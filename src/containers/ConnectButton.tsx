import { useEffect } from 'react';
import { useChain, useMoralis } from 'react-moralis';
import { ConnectButton } from '@web3uikit/web3';

import { CHAIN_ID } from '../constants';

const Button = () => {
  const { switchNetwork, chainId } = useChain();
  const { Moralis } = useMoralis();

  useEffect(() => {
    if (chainId !== CHAIN_ID) {
      if (Moralis.isWeb3Enabled()) {
        switchNetwork(CHAIN_ID);
      }
    }
  }, [chainId]);

  return (
    <ConnectButton />
  );
}

export default Button;
