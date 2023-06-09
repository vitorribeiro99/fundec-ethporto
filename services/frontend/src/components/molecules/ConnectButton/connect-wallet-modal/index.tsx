import React, { useState, useEffect } from "react";
import { Modal, ModalFooter, Button } from "@taikai/rocket-kit";

import { useWeb3 } from "../../../../hooks/useWeb3";
import { ConnectorList, Warning, Connector, Alert, Agreement, AddressStyle } from "./styles";
import useAddress from "../../../../hooks/useAddress";
import useMetaMaskOnboarding from "../../../../hooks/useMetaMaskOnboarding";

// Redux
import { useDispatch } from "react-redux";
import { setAddress } from "../../../../state/connection/connectionSlice";

type OnCloseFunctionType = () => void;

interface Props {
  onClose: OnCloseFunctionType;
}

const ShowEthAddress = () => {
  const { address = "" } = useAddress();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAddress({ address: address }));
  }, [address, dispatch]);

  return <AddressStyle>{address}</AddressStyle>;
};

const ConnectWalletModal: React.FC<Props> = (props: Props) => {
  const { connected, connect, disconnect, error } = useWeb3();
  const { isMetaMaskInstalled, startOnboarding } = useMetaMaskOnboarding();
  const { onClose } = props;
  return (
    <Modal
      zIndex={1001}
      isShowing={true}
      hide={() => {
        onClose();
      }}
      title="Connect Your Wallet"
      footer={false}
    >
      {!connected && isMetaMaskInstalled && (
        <>
          <Warning>
            You don&apos;t have a wallet connect, please choose of the following options:
          </Warning>
          <ConnectorList>
            <Connector onClick={() => connect()}>
              <img width={30} height={30} alt="Metamask" src="/metamask.png" />
              <span>Connect with Metamask</span>
            </Connector>
          </ConnectorList>
          <Agreement>
            By connecting a wallet, you agree to the "LayerX Web Boilerplate" Terms of Service and
            consent to its Privacy Policy.
          </Agreement>
        </>
      )}
      {!connected && !isMetaMaskInstalled && (
        <>
          <ConnectorList>
            <Connector onClick={() => startOnboarding()}>
              <img width={30} height={30} alt="Metamask" src="/metamask.png" />
              <span>Install Metamask</span>
            </Connector>
          </ConnectorList>
          <Alert>🚨 You don&apos;t have the metamask extension installed on your browser.</Alert>
        </>
      )}
      {connected && isMetaMaskInstalled && (
        <>
          <Warning>You are connected with Wallet address:</Warning>
          <ShowEthAddress />
        </>
      )}
      <ModalFooter closeValue={"Close"} closeAction={() => onClose()}>
        {connected && (
          <Button
            color={"red500"}
            disabled={!connected}
            value="Disconnect"
            action={() => disconnect()}
          />
        )}
      </ModalFooter>
    </Modal>
  );
};

export default ConnectWalletModal;
