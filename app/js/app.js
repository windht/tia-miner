// Open all links in external browser
var shell = require('electron').shell
document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
    event.preventDefault()
    shell.openExternal(event.target.href)
  }
})

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


angular.module('TIA-Miner', ['ngMaterial'])
.controller("MainCtrl", MainCtrl)
.factory("Miner",Miner)

function MainCtrl($mdDialog,$interval,Miner) {
    var vm = this;


    var path = require("path");
    var miner = require(path.join(__dirname,"renderer","miner"));
    var db = require(path.join(__dirname,"renderer","db"));
    var updateInterval;

    

    vm.toggle = toggle;
    vm.showFAQ = showFAQ;
    vm.showInfo = showInfo;
    vm.showPool = showPool;
    vm.showStat = showStat;

    init();

    function init() {
        vm.pools = db.get('pools').value();
        vm.pool = vm.pools[0] || {};

        stop();
    }

    function toggle() {
        if (vm.start) {
            stop()
        } else {
            start()
        }
    }

    function start() {

        if (!vm.pool.server || !vm.pool.port || !vm.pool.user || !vm.pool.pass) {
          return;
        }

        Miner.getWTM(vm.pool.currency).then(function(wtm){
          wtm.revenue = parseFloat(wtm.revenue.replace("$",""));
          console.log(wtm);
          vm.wtm = wtm;
        })

        vm.start = true;
        vm.controlButtonText = "End";
        // miner.ewbf.start('btg.suprnova.cc',8816,'windht.office','ht930531')
        miner.ewbf.start(
            vm.pool.server,
            vm.pool.port,
            vm.pool.user,
            vm.pool.pass
        )

        updateInterval = $interval(updateSpeed,1000)
    }

    function stop() {
        vm.start = false;
        vm.wtm = null;
        vm.profit = null;
        vm.controlButtonText = "Start";
        miner.ewbf.stop();

        $interval.cancel(updateInterval);
        updateInterval = null;

        vm.stat = {
          result:[],
          total_speed:0,
          total_power:0
        }
    }

    function updateSpeed(){
      Miner.EWBF.getSpeed().then(function(data){
        // console.log(result)
        vm.stat.result = data.result;
        vm.stat.total_speed = data.total_speed;
        vm.stat.total_power = data.total_power;

        if (vm.wtm){

          if (vm.stat.total_speed==0){
            vm.profit = 0;
          }
          else {
            var revenue = vm.stat.total_speed/870 * vm.wtm.revenue
            var cost = (vm.stat.total_power + 200)/1000 * 24 * 0.1;
            vm.profit = revenue - cost;
          }

          console.log(vm.profit);
        }
      })
    }

    function showFAQ(ev){
        $mdDialog.show({
          controller: function($mdDialog){
            var vm = this;
            vm.cancel = function(){
                $mdDialog.hide()
            }
          },
          controllerAs:"vm",
          templateUrl: 'app/dialog/faq.html',
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen:true

        })
    }

    function showInfo(ev){
        $mdDialog.show({
          controller: function($mdDialog){
            var vm = this;
            vm.cancel = function(){
                $mdDialog.hide()
            }
          },
          controllerAs:"vm",
          templateUrl: 'app/dialog/info.html',
          targetEvent: ev,
          clickOutsideToClose:true,

        })
    }

    function showPool(ev){
        $mdDialog.show({
          controller: function($mdDialog,pools){
            var vm = this;
            vm.pools = pools;
            vm.pool = vm.pools[0] || {};
            vm.guid = guid;

            vm.pool_list = [
            {
              name:"ZEC",
              slug:"zcash",
              wtm_id:166
            },
            {
              name:"BTG",
              slug:"bitcoin-gold",
              wtm_id:214
            },
            {
              name:"ZEN",
              slug:"zencash",
              wtm_id:185
            }
            ]
            vm.cancel = function(){
                $mdDialog.hide()
            }
            vm.save = function(){
                db.get('pools').write();
            }
          },
          controllerAs:"vm",
          templateUrl: 'app/dialog/pool.html',
          targetEvent: ev,
          locals:{
            pools:vm.pools
          },
          clickOutsideToClose:true,
          fullscreen:true
        })
    }

    function showStat(ev){
        $mdDialog.show({
          controller: function($mdDialog,stat,pool,Miner,$scope){
            var vm = this;
            var statWatcher;

            vm.stat = stat;
            vm.pool = pool;
            vm.cancel = function(){
                $mdDialog.hide()
            }

            // statWatcher = $scope.$watch(vm.stat,function(newValue){
            //   updateProfit();
            // })

            // $scope.$on("$destroy",function(){
            //   statWatcher();
            // })


          },
          controllerAs:"vm",
          templateUrl: 'app/dialog/stat.html',
          targetEvent: ev,
          locals:{
            stat:vm.stat,
            pool:vm.pool
          },
          clickOutsideToClose:true,
          fullscreen:true
        })
    }


};

function Miner($http,$q){
  return {
    EWBF:{
      getSpeed:function(){

        var q = $q.defer();

        $http.get("http://localhost:42000/getstat",{
          timeout:1000
        }).then(function(response){

          var stat = {};

          stat.result = response.data.result;
          stat.total_speed = 0;
          stat.total_power = 0;

          for (var i=0;i<stat.result.length;i++){
            stat.total_speed+=stat.result[i].speed_sps
            stat.total_power+=stat.result[i].gpu_power_usage
          }

          q.resolve(stat)
        },function(err){
          q.reject();
        })

        return q.promise;
      }
    },
    getWTM:function(currency){
      var q = $q.defer();
      $http.get("https://whattomine.com/coins/"+currency.wtm_id+".json").then(function(response){
        var data = response.data;
        q.resolve(data)
      })
      return q.promise;
    }
  }
}