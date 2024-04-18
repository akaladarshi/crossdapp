package main

import (
	"os"

	crossdapp "github.com/akaladarshi/crossdapp/app"
	"github.com/akaladarshi/crossdapp/cmd/crossdappd/cmds"
	svrcmd "github.com/cosmos/cosmos-sdk/server/cmd"
)

func main() {
	rootCmd, _ := cmds.NewRootCmd()
	if err := svrcmd.Execute(rootCmd, crossdapp.DefaultNodeHome); err != nil {
		os.Exit(1)
	}
}
