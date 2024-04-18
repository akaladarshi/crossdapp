package keeper_test

import (
	"testing"

	testkeeper "github.com/akaladarshi/crossdapp/testutil/keeper"
	"github.com/akaladarshi/crossdapp/x/gateway/types"
	"github.com/stretchr/testify/require"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.GatewayKeeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
