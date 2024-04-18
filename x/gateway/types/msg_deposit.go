package types

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const MaxMemoSize = 250

// NewMsgDeposit is a constructor function for NewMsgDeposit
func NewMsgDeposit(coins []Coin, memo string, signer sdk.AccAddress) *DepositRequest {
	return &DepositRequest{
		Coins:  coins,
		Memo:   memo,
		Signer: signer,
	}
}

// Route should return the route key of the module
func (m *DepositRequest) Route() string { return RouterKey }

// GetType should return the action
func (m DepositRequest) GetType() string { return "deposit" }

// ValidateBasic runs stateless checks on the message
func (m *DepositRequest) ValidateBasic() error {
	if m.Signer.Empty() {
		return sdkerrors.Wrap(sdkerrors.ErrInvalidAddress, m.Signer.String())
	}

	if m.Coins == nil {
		return sdkerrors.Wrap(sdkerrors.ErrUnknownRequest, "coins cannot be nil")
	}

	if len([]byte(m.Memo)) > MaxMemoSize {
		err := fmt.Errorf("memo must not exceed %d bytes: %d", MaxMemoSize, len([]byte(m.Memo)))
		return sdkerrors.Wrap(sdkerrors.ErrUnknownRequest, err.Error())
	}
	return nil
}

// GetSignBytes encodes the message for signing
func (m *DepositRequest) GetSignBytes() []byte {
	return sdk.MustSortJSON(ModuleCdc.MustMarshalJSON(m))
}

// GetSigners defines whose signature is required
func (m *DepositRequest) GetSigners() []sdk.AccAddress {
	return []sdk.AccAddress{m.Signer}
}
