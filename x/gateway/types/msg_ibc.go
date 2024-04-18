package types

import "github.com/gogo/protobuf/proto"

func NewIBCMsgPacketData(
	msgType string,
	msg proto.Message,
) (IBCMsgPacketData, error) {
	data, err := proto.Marshal(msg)
	if err != nil {
		return IBCMsgPacketData{}, err
	}

	return IBCMsgPacketData{
		MsgType: msgType,
		Data:    data,
	}, nil
}
