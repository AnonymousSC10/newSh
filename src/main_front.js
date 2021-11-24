const Web3 = require("web3");
var baseURL = "http://localhost",
  web3,
  metamaskAccounts = [],
  myAccount,
  isConnected;

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function checkConnection () {
  // Check if browser is running Metamask
  let result;
  if (window.ethereum) {
      web3 = new Web3(window.ethereum);
  };

  // Check if User is already connected by retrieving the accounts
  metamaskAccounts = await web3.eth.getAccounts();
  result = (metamaskAccounts.length != 0);
  
  if (result) myAccount = metamaskAccounts[0]; 
  //showHeaderInfo();

  return result;
};

const metamask_connect = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    if (networkId != 56) {
      await window.ethereum.request({   method: 'wallet_switchEthereumChain',   params: [{ chainId: '0x38' }] });
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      metamaskAccounts = await web3.eth.getAccounts();
      myAccount = metamaskAccounts[0];

      isConnected = (metamaskAccounts.length != 0);
    } catch (err) {
      console.log('User rejected the request.');
    }
  } else {
    //displayAlert('Error', 'MetaMask is required.');
    console.log('MetaMask is required.');
  }
};

window.onload = () => {

  checkConnection().then(function(result) {
    isConnected = result;

    if (!result) {
      sleep(50000).then(() => {
        metamask_connect();
      })
    }
  });

};
