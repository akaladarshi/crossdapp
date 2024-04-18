package keeper

import (
	"github.com/akaladarshi/crossdapp/x/gateway/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	ibctransfertypes "github.com/cosmos/ibc-go/v4/modules/apps/transfer/types"
	clienttypes "github.com/cosmos/ibc-go/v4/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v4/modules/core/04-channel/types"
	porttypes "github.com/cosmos/ibc-go/v4/modules/core/05-port/types"
	host "github.com/cosmos/ibc-go/v4/modules/core/24-host"
	"github.com/cosmos/ibc-go/v4/modules/core/exported"
	ibcexported "github.com/cosmos/ibc-go/v4/modules/core/exported"
	"github.com/gogo/protobuf/proto"
)

type IBCKeeper struct {
	Keeper
	ChannelKeeper types.ChannelKeeper
	ScopedKeeper  types.ScopedKeeper
}

func NewIBCKeeper(keep Keeper, chanKeep types.ChannelKeeper, scopeKeep types.ScopedKeeper) IBCKeeper {
	return IBCKeeper{
		Keeper:        keep,
		ChannelKeeper: chanKeep,
		ScopedKeeper:  scopeKeep,
	}
}

func (k IBCKeeper) OnReceivePacket(ctx sdk.Context, module porttypes.IBCModule, bankKeep types.BankKeeper, accKeep types.AccountKeeper, packet channeltypes.Packet, relayer sdk.AccAddress) exported.Acknowledgement {
	// The acknowledgement is considered successful if it is a ResultAcknowledgement,
	// follow ibc transfer convention, put byte(1) in ResultAcknowledgement to indicate success.
	ack := channeltypes.NewResultAcknowledgement([]byte{byte(1)})

	// data, err := ToICS20Packet(packet)
	// if err != nil {
	// 	return channeltypes.NewErrorAcknowledgement(err.Error())
	// }

	// err = ValidatePacketData(accK, data)
	// if err != nil {
	// 	return channeltypes.NewErrorAcknowledgement(fmt.Sprintf("failed to validate packet data: %w", err))
	// }

	return ack
}

// ToICS20Packet unmarshal IBC packet as ICS20 token packet
func ToICS20Packet(packet ibcexported.PacketI) (ibctransfertypes.FungibleTokenPacketData, error) {
	var data ibctransfertypes.FungibleTokenPacketData
	if err := ibctransfertypes.ModuleCdc.UnmarshalJSON(packet.GetData(), &data); err != nil {
		return ibctransfertypes.FungibleTokenPacketData{}, sdkerrors.Wrapf(sdkerrors.ErrInvalidType, "cannot unmarshal ICS-20 transfer packet data")
	}

	if err := data.ValidateBasic(); err != nil {
		return ibctransfertypes.FungibleTokenPacketData{}, err
	}

	return data, nil
}

// TransmitIBCMsgPacket transmits the packet over IBC with the specified source port and source channel
func (k IBCKeeper) TransmitIBCMsgPacket(
	ctx sdk.Context,
	packetData ibctransfertypes.FungibleTokenPacketData,
	sourcePort,
	sourceChannel string,
	timeoutHeight clienttypes.Height,
	timeoutTimestamp uint64,
) error {

	sourceChannelEnd, found := k.ChannelKeeper.GetChannel(ctx, sourcePort, sourceChannel)
	if !found {
		return sdkerrors.Wrapf(channeltypes.ErrChannelNotFound, "port ID (%s) channel ID (%s)", sourcePort, sourceChannel)
	}

	destinationPort := sourceChannelEnd.GetCounterparty().GetPortID()
	destinationChannel := sourceChannelEnd.GetCounterparty().GetChannelID()

	// get the next sequence
	sequence, found := k.ChannelKeeper.GetNextSequenceSend(ctx, sourcePort, sourceChannel)
	if !found {
		return sdkerrors.Wrapf(
			channeltypes.ErrSequenceSendNotFound,
			"source port: %s, source channel: %s", sourcePort, sourceChannel,
		)
	}

	channelCap, ok := k.ScopedKeeper.GetCapability(ctx, host.ChannelCapabilityPath(sourcePort, sourceChannel))
	if !ok {
		return sdkerrors.Wrap(channeltypes.ErrChannelCapabilityNotFound, "module does not own channel capability")
	}

	packetBytes, err := proto.Marshal(&packetData)
	if err != nil {
		return sdkerrors.Wrap(sdkerrors.ErrJSONMarshal, "cannot marshal the packet: "+err.Error())
	}

	packet := channeltypes.NewPacket(
		packetBytes,
		sequence,
		sourcePort,
		sourceChannel,
		destinationPort,
		destinationChannel,
		timeoutHeight,
		timeoutTimestamp,
	)

	if err := k.ChannelKeeper.SendPacket(ctx, channelCap, packet); err != nil {
		return err
	}

	return nil
}
