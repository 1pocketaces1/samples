App = {
web3Provider: null,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    var Web3 = require('web3');
    var BigNumber = require('bignumber.js');

    if (typeof web3 !== 'undefined') {

      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {

    var marketABI = JSON.parse(
      '{"contractName":"Marketplace","abi":[{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"bytes32"},{"indexed":true,"name":"assetId","type":"uint256"},{"indexed":true,"name":"seller","type":"address"},{"indexed":false,"name":"priceInWei","type":"uint256"},{"indexed":false,"name":"expiresAt","type":"uint256"}],"name":"AuctionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"bytes32"},{"indexed":true,"name":"assetId","type":"uint256"},'+
      '{"indexed":true,"name":"seller","type":"address"},{"indexed":false,"name":"totalPrice","type":"uint256"},{"indexed":true,"name":"winner","type":"address"}],"name":"AuctionSuccessful","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"bytes32"},{"indexed":true,"name":"assetId","type":"uint256"},{"indexed":true,"name":"seller","type":"address"}],"name":"AuctionCancelled","type":"event"}]}');

    var landABI = JSON.parse(
      '{"contractName":"LANDRegistry","abi":[{"constant":true,"inputs":[{"name":"value","type":"uint256"}],"name":"decodeTokenId","outputs":[{"name":"","type":"int256"},{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"}]}'
    );

    var Market = web3.eth.contract(marketABI.abi);
    var Land = web3.eth.contract(landABI.abi);
    var MarketInstance = Market.at('0xb3bca6f5052c7e24726b44da7403b56a8a1b98f8');
    console.log(MarketInstance);
    var LandInstance = Land.at('0xddd001ced3619edfbdb5be7cf7f982002093f426');
    console.log(LandInstance);
    App.getEvents(MarketInstance, LandInstance);
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },


  buildChart: function(prices) {
    var points = [];
    for (i = 0; i < prices.length; i++) {
      points[i] = "{" + i + "," + parseInt(prices[i]) + " }";
    }
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBackgroundColor);

    function drawBackgroundColor() {
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Sale');
      data.addColumn('number', 'Price');
      data.addRows(points);
    }
    var options = {
        hAxis: {
          title: 'Sale'
        },
        vAxis: {
          title: 'Price (MANA)'
        },
        backgroundColor: '#f1f8e9'
      };
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  },

  // buildTable: function() {
  //   console.log(sales[5]);
  //   $('#txTable').DataTable({
  //     stateSave: true,
  //     scrollY: '70vh',
  //     scrollCollapse: true,
  //     paging: false,
  //     data: sales,
  //     columns: [
  //       { data: "Land" },
  //       { data: "Price" },
  //       { data: "Time" },
  //     ]
  //   });
  //   console.log("done");
  // },

  getEvents: function(MarketInstance, LandInstance) {
    sales = [];
    var sellEvent = MarketInstance.AuctionSuccessful({}, {fromBlock: 0, toBlock: 'latest'});

    sellEvent.get(function(error, logs) {
      if (!error) {
        var table = document.getElementById("txTable");
        for (i = 0; i < logs.length; i++) {
          var log = logs[i];
          var _land = [];
          var _time = "";
          web3.eth.getBlock(logs[i].blockNumber,
            function(error, result) {
              if (error) { console.log("error"); }
              else {
                _temp = new Date(result.timestamp * 1000);
                _time = _temp.toUTCString();
              }
            }
          );

          // var row = table.insertRow(0);
          // var land = row.insertCell(0);
          // var price = row.insertCell(1);
          // var sold = row.insertCell(2);
          // var bought = row.insertCell(3);


          var landId = new BigNumber(log.args.assetId).toFixed();
          LandInstance.decodeTokenId(landId,
            function(error, result) {
              if (error) { console.log("error"); }
              else {
                 _land = result;
                 var _price = web3.fromWei(log.args.totalPrice, 'ether');
                 var _sold = log.args.seller;
                 var _bought = log.args.winner;
                 var id = "(" + _land[0].toString() + "," + _land[1].toString() + ")";
                 sales.push(new Sale(id,_price,_sold,_bought,_time));
                 // var row = document.createElement("tr");
                 // var land = document.createElement("td");
                 // row.appendChild(land);
                 // land.innerHTML = "(" + _land[0].toString() + "," + _land[1].toString() + ")";
                 // var price = document.createElement("td");
                 // row.appendChild(price);
                 // price.innerHTML = _price;
                 // var sold = document.createElement("td");
                 // row.appendChild(sold);
                 // sold.innerHTML = _sold;
                 // var bought = document.createElement("td");
                 // row.appendChild(bought);
                 // bought.innerHTML = _bought;
                 // land.innerHTML = "(" + _land[0].toString() + "," + _land[1].toString() + ")";
                 // price.innerHTML = _price;
                 // sold.innerHTML = _sold;
                 // bought.innerHTML = _bought;
              }
            }
          );
        }
      }
    });
    setTimeout(
      function() {
        console.log(sales[3]);
        $('#txTable').DataTable({
          stateSave: true,
          scrollY: '70vh',
          scrollCollapse: true,
          paging: false,
          data: sales,
          columns: [
            { data: "Land" },
            { data: "Price" },
            { data: "Time" },
          ]
        });
      },
    7000);
  },

  getArtifacts: function(filename) {
    $.getJSON(filename, function(data) {
      return data;
    });
  }
};

$(function() {
  $(window).load(function() {
    console.log("display");
    App.init();
  });
});
