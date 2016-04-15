/*
<div ng-app="app">
    <div ng-controller="MainCtrl">
        <input type="number" delipenguen-validate-tckn ng-model="txtTcKimlikNo.text" placeholder="TC Kimlik No" required>
  
        <div ng-show="txtTcKimlikNo.status" class="messageCss">
            {{txtTcKimlikNo.message}}
        </div>
    </div>
</div>

.messageCss {
  color: #DD2C00;
  font-size: 12px;
  border-top: 1px solid #DD2C00;
  background-color: #f5f5f5;
  margin-top:10px;
}

Çalışan Örnek
https://jsfiddle.net/DeliPenguen/2mz3z9ax/2/
*/
angular.module('app', [])
    .directive('delipenguenValidateTckn', function () {
        function getLastChar(val) {
            var _val = String(val);
            var _tpl = 0;
            for (var i = 0; i < 10; i++) {
                _tpl += parseInt(_val.substr(i, 1));
            }
            var _tplStr = String(_tpl);
            var _tplLen = _tplStr.length;
            var _tplLastChar = _tplStr.substr((_tplLen - 1), 1);
            return _tplLastChar;
        }

        function tenthValue(_val) {
            var _tckn = _val.substr(0, 9);
            var _map = Array.prototype.map;
            var _stringToArray = _map.call(_tckn, function (x) {
                return x.split('')
            });
            var _stringToArrayObj = JSON.parse("[" + _stringToArray + "]");
            var _oddNumberTotal = 0;
            var _evenNumberTotal = 0;
            var _tenthValue = _stringToArrayObj.reduce(function (previousValue, currentValue, currentIndex, array) {
                if (currentIndex % 2 == 0) { // 1,3,5,7,9
                    _oddNumberTotal = parseInt(_oddNumberTotal) + parseInt(currentValue);
                } else { // 2,4,6,8
                    _evenNumberTotal = parseInt(_evenNumberTotal) + parseInt(currentValue);
                }
                return ((_oddNumberTotal * 7) - _evenNumberTotal) % 10;
            }, 0);
            return _tenthValue;
        }

        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    /*
                    # --- TC Kimlik No Doğrulama Algoritması --- #
                    KURAL-1: Tüm karakterleri rakam olmalıdır.
                    KURAL-2: TC Kimlik numarası 11 basamaktan oluşmalıdır.
                    KURAL-3: İlk hanesi 0 olamaz.
                    KURAL-4: İlk 9 basamak arasındaki algoritma, 10. basmağı vermelidir.
                    İŞLEM: 1. 3. 5. 7. ve 9. hanelerin toplamının 7 katından, 2. 4. 6. ve 8. hanelerin toplamı çıkartıldığında, 
                    elde edilen sonucun 10′a bölümünden kalan, yani Mod10′u bize 10. haneyi verir.
                    KURAL-5: İlk 10 basamak arasındaki algoritma, 11. basamağı vermelidir.
                    İŞLEM: 1. 2. 3. 4. 5. 6. 7. 8. 9. ve 10. hanelerin toplamından elde edilen sonucun 
                    10′a bölümünden (Mod 10) kalan, bize 11. haneyi verir.
                    */
                    var _ngModelNameFull = attrs.ngModel;
                    var _ngModelName = _ngModelNameFull.split(".");
                    var _error = false;
                    if (elm.val().length === 0) {
                        _error = true;
                        scope[_ngModelName[0]].message = "TC Kimlik No giriniz.";
                    }
                    // KURAL-2
                    if (elm.val().length > 0 && elm.val().length !== 11) {
                        _error = true;
                        scope[_ngModelName[0]].message = "TC Kimlik No 11 karakter olmalıdır.";
                    }
                    // KURAL-3
                    if (elm.val().substr(0, 1) === "0") {
                        _error = true;
                        scope[_ngModelName[0]].message = "TC Kimlik Numarasının ilk karakteri 0 (Sıfır) olamaz.";
                    }
                    // KURAL-4
                    if (elm.val().length > 9) {
                        if (tenthValue(elm.val()) != elm.val().substr(9, 1)) {
                            _error = true;
                            scope[_ngModelName[0]].message = "Geçerli bir TC Kimlik No giriniz.";
                        }
                    }
                    // KURAL-5
                    if (elm.val().length === 11) {
                        if (getLastChar(elm.val()) !== String(elm.val()).substr(10, 1)) {
                            _error = true;
                            scope[_ngModelName[0]].message = "Geçerli bir TC Kimlik No giriniz.";
                        }
                    }
                    if (_error === true) {
                        scope[_ngModelName[0]].status = true;
                    } else {
                        scope[_ngModelName[0]].status = false;
                    }
                });
            }
        };
    })
    .controller('MainCtrl', ['$scope', function ($scope) {
        $scope.txtTcKimlikNo = {
            status: true,
            message: "TC Kimlik No giriniz."
        };
}]);