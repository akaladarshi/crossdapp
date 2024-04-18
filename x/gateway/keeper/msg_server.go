package keeper

import (
	"context"

	"github.com/akaladarshi/crossdapp/x/gateway/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	ibctransfertypes "github.com/cosmos/ibc-go/v4/modules/apps/transfer/types"
	clienttypes "github.com/cosmos/ibc-go/v4/modules/core/02-client/types"
)

var _ types.MsgServer = msgServer{}

type msgServer struct {
	Keeper
	ibcK IBCKeeper
}

// NewMsgServerImpl returns an implementation of the MsgServer interface
// for the provided Keeper.
func NewMsgServerImpl(keeper Keeper, ibcKeep IBCKeeper) types.MsgServer {
	return &msgServer{
		Keeper: keeper,
		ibcK:   ibcKeep,
	}
}

func (s msgServer) SendIBCMsg(goCtx context.Context, msg *types.DepositRequest) (*types.DepositResponse, error) {
	// validate incoming message
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: logic before transmitting the packet

	// Construct the packet
	msgData, err := types.NewIBCMsgPacketData(msg.GetType(), msg)
	if err != nil {
		return nil, err
	}

	packet := ibctransfertypes.FungibleTokenPacketData{
		Denom:    "osmosis",
		Amount:   msg.Coins[0].Amount.String(),
		Sender:   msg.Creator,
		Receiver: msg.Receiver,
		Memo:     msgData.String(),
	}

	// Transmit the packet
	err = s.ibcK.TransmitIBCMsgPacket(
		ctx,
		packet,
		msg.Port,
		msg.ChannelID,
		clienttypes.ZeroHeight(),
		msg.TimeoutTimestamp,
	)
	if err != nil {
		return nil, err
	}

	return &types.DepositResponse{}, nil
}
