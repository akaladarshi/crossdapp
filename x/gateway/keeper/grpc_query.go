package keeper

import (
	"github.com/akaladarshi/crossdapp/x/gateway/types"
)

var _ types.QueryServer = Keeper{}
