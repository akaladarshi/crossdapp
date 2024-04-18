package gateway_test

import (
	"testing"

	keepertest "github.com/akaladarshi/crossdapp/testutil/keeper"
	"github.com/akaladarshi/crossdapp/testutil/nullify"
	"github.com/akaladarshi/crossdapp/x/gateway"
	"github.com/akaladarshi/crossdapp/x/gateway/types"
	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.GatewayKeeper(t)
	gateway.InitGenesis(ctx, *k, genesisState)
	got := gateway.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	// this line is used by starport scaffolding # genesis/test/assert
}
