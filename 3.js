


(function main(React, ReactNative, NativeBase, componentState, StyleSheet,
    Dimensions, Loader, navigate,localStorage,api,require) {
    'use strict';


    var react_1 = React;
    var _reactNative = ReactNative;
    var _nativebase = NativeBase;
    var root = this;

    var titleSize = 3.2;
    var grayColor = "#d9d9d9";

    var styles = StyleSheet.create({
        containerStyle: {
            flex:1,
            backgroundColor: 'transparent',
        },
        viewStyle: {
            // marginTop: '20%',
            // height: Dimensions.get('window').height / 3
            flex:1
        },
        userNameItem: {
            width: "90%",
            marginLeft: "5%",
            marginRight: "5%",
            marginTop: "5%",
        },
        inputStyle: {
            color: '#2B7B9F',
            paddingLeft: 10,
            fontSize: 24,
            fontWeight: '500',
            width: '100%',
            height: 50,
            borderWidth: 1,
            borderColor: '#ccc',
        },
        passwordItem: {
            width: "90%",
            marginLeft: "5%",
            marginRight: "5%",
            marginTop: "5%",
        },
        passwordlabel: {
            color: '#2B7B9F',
            fontFamily: 'Arial',
            marginBottom: 5,
            fontSize: 22
        },
        userNameLabel: {
            color: '#2B7B9F',
            fontFamily: 'Arial',
            marginBottom: 5,
            fontSize: 22
        },
        loginButton: {
            backgroundColor: '#4568DC',
            marginTop: '5%',
            marginLeft: '5%',
            marginRight: '5%',
            width: '90%',
            textAlign: 'center',
            justifyContent: 'center'
        },
        imageStyle: {
            width: '90%',
            height: 180,
        },
        loginButtonLabel: {
            color: '#FFFFFF',
            fontSize: 20,
            fontFamily: 'Arial',
            textAlign: 'center',
            justifyContent: 'center'

        },
        activityIndicatorWrapper: {
            backgroundColor: '#FFFFFF',
            top: '40%',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around'
        }
    });


    function showLoading(localState) {
        localState.setState({ isLoading: true });
    }

    function hideLoading(localState) {
        //console.warn("hide Loading");
        localState.setState({ isLoading: false });
    }

    function loginCall(localState) {
        var userJsonData = { "loginName": localState.state.userName, "password": localState.state.password };
        console.warn("In Login")
        showLoading(localState);

        localStorage.getData("LoginData").then(function(result){
            console.warn(result);    
            if (result != null) {
                //console.warn(result);
                hideLoading(localState);
                //const { navigate } = this.props.navigation;
                navigate('AccountSummary');
            } else {
                console.warn("Login");
                api.fetchAsync("https://cfsfiserv.com/QEUATSMT/api/Authentication/LogIn",
                    "POST",
                    {
                        'Content-Type': 'application/json',
                    },
                    JSON.stringify(userJsonData)
                ).then(function(loginresult){
                     
                    console.warn(loginresult);

                    if (loginresult == '' || loginresult == undefined) {
                        _nativebase.Toast.show({
                            text: 'Please enter the valid UserName and Password',
                            position: 'bottom',
                            buttonText: 'Okay',
                            duration: 5000,
                            type: 'danger'
                        });
                        return
                    }

                    localState.setState({
                        antiForgeryToken: loginresult.antiForgeryToken,
                        sessionTimeout: loginresult.sessionTimeout,
                        sessionExpiredText: loginresult.sessionExpiredText
                    },function(){hideLoading(localState)});

                    localStorage.saveData("LoginData", result).then(function(result) {
                    });
                    
                    navigate('AccountSummary');

                }).catch(function(err){
                    alert(JSON.stringify(err));
                    hideLoading(localState);
                });
            }
        }).catch(function(err){
            alert(JSON.stringify(err));
            hideLoading(localState);
        });

       
    }


    function validateUser(localState) {
        if (localState.state.userName === '' || localState.state.userName == undefined) {
            _nativebase.Toast.show({
                text: 'Please enter Username',
                position: 'bottom',
                buttonText: 'Okay',
                duration: 5000,
                type: 'danger'
            });
        } else if (localState.state.password === '' || localState.state.password == undefined) {
            _nativebase.Toast.show({
                text: 'Please enter Password',
                position: 'bottom',
                buttonText: 'Okay',
                duration: 5000,
                type: 'danger'
            });
        } else {
                loginCall(localState)
        }
    }


    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    var _react = React;

    var _reactNative = ReactNative;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var NewComponent = function (_React$Component) {
        _inherits(NewComponent, _React$Component);
        function NewComponent(props) {
            _classCallCheck(this, NewComponent);

            var _this = _possibleConstructorReturn(this, (NewComponent.__proto__ || Object.getPrototypeOf(NewComponent)).call(this, props));

            _this.state = {
                userName: "",
                password: "",
                isLoading: false,
            }
            return _this;
        }

        _createClass(NewComponent, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                console.warn('New component mounted');
            }
        }, {
            key: 'render',
            value: function render() {
                var _this = this;

                return react_1.createElement(_nativebase.Container, { style: styles.containerStyle }, [
                    react_1.createElement(Loader, 
                        { "key": "LoaderItem", isLoading: _this.state.isLoading 
                        },
                        [
                        ]),
                    react_1.createElement(_reactNative.View, {
                        "key": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl04_field_container",
                        style: styles.viewStyle
                    }, [
                            react_1.createElement(_reactNative.Image, {
                                "key": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl0423_Label_container",
                                style: styles.imageStyle,
                                source: { uri: 'https://raw.githubusercontent.com/nagred01/Login/style/logo.png' }
                            }, null),
                            react_1.createElement(_reactNative.View, {
                                "key": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl04_Label_container",
                                style: styles.userNameItem
                            }, [
                                    react_1.createElement(_nativebase.Label, {
                                        "htmlFor": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl04",
                                        "key": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl04_Label",
                                        style: styles.userNameLabel
                                    }, ["UserName"]),
                                    react_1.createElement(_reactNative.TextInput, {
                                        "id": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl04",
                                        "key": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl04",
                                        "cssClass": "form-control component-group",
                                        "fieldCssClass": "",
                                        style: styles.inputStyle,
                                        autoCapitalize: 'none',
                                        "bindingMode": "",
                                        onChangeText: function (val) {
                                            _this.setState({ userName: val });
                                        },
                                        placeHolder: "Enter the User Name"
                                    }, [])
                                ]),
                            react_1.createElement(_reactNative.View, {
                                "key": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl04_Label_container",
                                style: styles.userNameItem
                            }, [
                                    react_1.createElement(_nativebase.Label, {
                                        "htmlFor": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl04",
                                        "key": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl04_Label",
                                        style: styles.passwordlabel
                                    }, ["Password"]),
                                    react_1.createElement(_reactNative.TextInput, {
                                        "id": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl04",
                                        "key": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl04",
                                        "cssClass": "form-control component-group",
                                        "fieldCssClass": "",
                                        style: styles.inputStyle,
                                        "bindingMode": "",
                                        onChangeText: function (val) {
                                            _this.setState({password: val })
                                        },
                                        autoCapitalize: 'none',
                                        secureTextEntry: true,
                                        placeHolder: "Enter the Password"
                                    }, [])
                                ]),
                            react_1.createElement(_nativebase.Button, {
                                "id": "M_layout_content_PCDZ_MNS7LAN_ctl00_btnCancel",
                                "key": "M_layout_content_PCDZ_MNS7LAN_ctl00_btnCancel",
                                style: styles.loginButton,
                                onPress: function () { validateUser(_this) }

                            }, [react_1.createElement(_reactNative.Text, {
                                "htmlFor": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl023",
                                "key": "M_layout_content_PCDZ_MNS7LAN_ctl00_ctl023_Label",
                                style: styles.loginButtonLabel,
                            }, ["Login"])])
                        ])
                ])
            }
        }]);

        return NewComponent;
    }(react_1.Component);

    return NewComponent
})
