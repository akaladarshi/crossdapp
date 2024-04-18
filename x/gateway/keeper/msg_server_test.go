package keeper_test

import (
	"context"
	"testing"

	keepertest "github.com/akaladarshi/crossdapp/testutil/keeper"
	"github.com/akaladarshi/crossdapp/x/gateway/keeper"
	"github.com/akaladarshi/crossdapp/x/gateway/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func setupMsgServer(t testing.TB) (types.MsgServer, context.Context) {
	k, ctx := keepertest.GatewayKeeper(t)
	return keeper.NewMsgServerImpl(*k), sdk.WrapSDKContext(ctx)
}
