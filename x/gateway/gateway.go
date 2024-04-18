package gateway

import (
	"github.com/akaladarshi/crossdapp/x/gateway/keeper"
	"github.com/akaladarshi/crossdapp/x/gateway/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	capabilitytypes "github.com/cosmos/cosmos-sdk/x/capability/types"
	channelttype "github.com/cosmos/ibc-go/v4/modules/core/04-channel/types"
	porttypes "github.com/cosmos/ibc-go/v4/modules/core/05-port/types"
	"github.com/cosmos/ibc-go/v4/modules/core/exported"
)

type IBCModule struct {
	ibcModule porttypes.IBCModule
	keeper    keeper.IBCKeeper
	bankK     types.BankKeeper
	accK      types.AccountKeeper
}

func NewIBCModule(
	ibcMod porttypes.IBCModule,
	keep keeper.IBCKeeper,
	bankK types.BankKeeper,
	accKeep types.AccountKeeper,
) IBCModule {
	return IBCModule{
		ibcModule: ibcMod,
		keeper:    keep,
		bankK:     bankK,
		accK:      accKeep,
	}
}
func (g IBCModule) OnChanOpenInit(ctx sdk.Context, order channelttype.Order, connectionHops []string, portID string, channelID string, channelCap *capabilitytypes.Capability, counterparty channelttype.Counterparty, version string) (string, error) {
	return g.ibcModule.OnChanOpenInit(ctx, order, connectionHops, portID, channelID, channelCap, counterparty, version)
}

func (g IBCModule) OnChanOpenTry(ctx sdk.Context, order channelttype.Order, connectionHops []string, portID, channelID string, channelCap *capabilitytypes.Capability, counterparty channelttype.Counterparty, counterpartyVersion string) (version string, err error) {
	return g.ibcModule.OnChanOpenTry(ctx, order, connectionHops, portID, channelID, channelCap, counterparty, counterpartyVersion)
}

func (g IBCModule) OnChanOpenAck(ctx sdk.Context, portID, channelID string, counterpartyChannelID string, counterpartyVersion string) error {
	return g.ibcModule.OnChanOpenAck(ctx, portID, channelID, counterpartyChannelID, counterpartyVersion)
}

func (g IBCModule) OnChanOpenConfirm(ctx sdk.Context, portID, channelID string) error {
	return g.ibcModule.OnChanOpenConfirm(ctx, portID, channelID)
}

func (g IBCModule) OnChanCloseInit(ctx sdk.Context, portID, channelID string) error {
	return g.ibcModule.OnChanCloseInit(ctx, portID, channelID)
}

func (g IBCModule) OnChanCloseConfirm(ctx sdk.Context, portID, channelID string) error {
	return g.ibcModule.OnChanCloseConfirm(ctx, portID, channelID)
}

func (g IBCModule) OnRecvPacket(ctx sdk.Context, packet channelttype.Packet, relayer sdk.AccAddress) exported.Acknowledgement {
	ack := g.ibcModule.OnRecvPacket(ctx, packet, relayer)
	if !ack.Success() {
		return ack
	}

	return g.keeper.OnReceivePacket(ctx, g.ibcModule, g.bankK, g.accK, packet, relayer)
}

func (g IBCModule) OnAcknowledgementPacket(ctx sdk.Context, packet channelttype.Packet, acknowledgement []byte, relayer sdk.AccAddress) error {
	// TODO implement me
	panic("implement me")
}

func (g IBCModule) OnTimeoutPacket(ctx sdk.Context, packet channelttype.Packet, relayer sdk.AccAddress) error {
	return g.ibcModule.OnTimeoutPacket(ctx, packet, relayer)
}
