var app = angular.module("tinyClock", []);
app.controller('controller', ['$scope', '$interval',
    function($scope, $interval) {
        $scope.breakTime = 2;
        $scope.sessionTime = 1;
        $scope.sessionName = "START";
        $scope.mm = $scope.sessionTime;
        $scope.ss = 0;
        $scope.timeLeft = $scope.mm + ":" + $scope.ss;

        var greenColor = "#33cc00";
        var redColor = "#ff6666";
        $scope.borderColor = "2px solid " + greenColor;
        var ifStart = false;//判断是否已经开始倒计时
        var start;//用来存储倒计时函数
        var second = $scope.mm * 60 + $scope.ss;//剩余多少秒

        //设定break和session两侧+和-号按钮的功能
        $scope.break = function(i){
            if( ifStart ===false && $scope.breakTime + i <=5 && $scope.breakTime + i >=1){
                $scope.breakTime += i;
                if($scope.sessionName === "BREAK"){
                    $scope.timeLeft = $scope.breakTime;
                    second = $scope.timeLeft * 60;
                }
            }
        }
        $scope.session = function(j){
            if( ifStart ===false && $scope.sessionTime +j <=25 && $scope.sessionTime +j >=1){
                $scope.sessionTime += j;
                if($scope.sessionName === "START"){
                    $scope.timeLeft = $scope.sessionTime;
                    second = $scope.timeLeft * 60;
                }
            }
        }

        //暂停或继续倒计时
        $scope.pauseOrStart = function(){

            // if ( angular.isDefined(stop) ) return;
            if(ifStart === false){
                ifStart = true;
                $('button').attr('disabled',ifStart);//开始倒计时，禁用按钮
                clockTicking();
            }else if(ifStart === true){
                ifStart = false;
                $('button').attr('disabled',ifStart);//启用按钮
                $interval.cancel(start); //停止倒计时
                start = undefined;//清空start设定
                return;
            }
        }

        //根据sessionName，获取填充颜色和总时长
        function setColorAndTimeLength(sessionName){
            var timeLength;
            if(sessionName === "START"){
                $scope.fillColor = greenColor;
                $scope.borderColor = "2px solid " + greenColor;
                timeLength = $scope.sessionTime *60;
            }else if(sessionName === "BREAK"){
                $scope.fillColor = redColor;
                $scope.borderColor = "2px solid " + redColor;
                timeLength = $scope.breakTime *60;
            }
            return timeLength;
        }

        //获取mm和ss的值，并$interval倒计时
        function clockTicking(){
            var timeLength;

            timeLength = setColorAndTimeLength($scope.sessionName);

            start = $interval(function() {
                if (second === 0) {
                    if($scope.sessionName === "START"){
                        $scope.sessionName = "BREAK";
                        timeLength = setColorAndTimeLength($scope.sessionName);
                        second = timeLength;
                    }else if($scope.sessionName === "BREAK"){
                        $scope.sessionName = "START";
                        timeLength = setColorAndTimeLength($scope.sessionName);
                        second = timeLength;
                    }
                }
                second -= 1;
                $scope.mm = Math.floor(second/60);
                $scope.ss = second%60;
                $scope.timeLeft = $scope.mm + ":" + $scope.ss;
                $scope.fillHeight = (100 -second/timeLength*100) +"%";

            }, 1000);
        }

        $scope.$on('$destroy', function() {
            // Make sure that the interval is destroyed too
            ifStart = false;
            $interval.cancel(start);
            start = undefined;
            return;
        });
    }]);