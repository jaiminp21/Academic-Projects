(function main(React, ReactNative, componentState, Button, StyleSheet1,
    responsiveHeight, responsiveFontSize, Platform,
    navigate, Loader, _nativebase, require) {
    'use strict';

    var titleSize = 3.2;
    var grayColor = "#d9d9d9";

    var styles = StyleSheet1.create({
        container: {
            flex: 1,
        },
        scrollView: {
            flex: 1,
            backgroundColor: "white",
            padding: responsiveHeight(2)
        },
        mainSubContainer: {
            paddingBottom: responsiveHeight(2),
            paddingLeft: responsiveHeight(1.5)
        },
        labelText: {
            fontSize: responsiveFontSize(titleSize),
            textAlign: "justify"
        },
        mainContainer: {
            justifyContent: "flex-start", backgroundColor: "white", padding: responsiveHeight(1)
        },
        grayLine: {
            marginLeft: responsiveHeight(1), marginRight: responsiveHeight(1)
        },
        usernameContainer: {
            marginTop: responsiveHeight(2),
            backgroundColor: "#FAFAFA",
            borderRadius: 1,
            padding: responsiveHeight(2.2)
        },
        iosStyle: {
            paddingTop: 10
        },
        block: {
            flex: 1
        }
        , usernameSubcontainer: {
            marginTop: responsiveHeight(3)
        },
        colorBlue: {
            color: "blue"
        },
        textInput: {
            borderWidth: 0.9, padding: 0,
            backgroundColor: "white",
            borderColor: "gray"
        },
        saveButton: {
            fontSize: responsiveFontSize(2),
            fontWeight: "normal",
            padding: responsiveHeight(0.5),
            color: "white",
            borderWidth: responsiveHeight(0.1),
            borderColor: "#015EBF",
            backgroundColor: "#0061b8"
        },
        saveButtonContainer: {
            marginTop: responsiveHeight(4)
        },
        saveButtonSubContainer: {
            marginTop: responsiveHeight(2)
        },
        passwordContainer:{
            marginTop: responsiveHeight(1)
        }

    });


    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    var _react2 = React;

    var _reactNative = ReactNative;


    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }


    function showLoading(localState) {
        localState.setState({ isLoading: true });
    }

    function hideLoading(localState) {
        //console.warn("hide Loading");
        localState.setState({ isLoading: false });
    }



    var NewComponent = function (_React$Component) {
        _inherits(NewComponent, _React$Component);
        //console.log(_react2.Component)
        function NewComponent(props) {
            _classCallCheck(this, NewComponent);

            var _this = _possibleConstructorReturn(this, (NewComponent.__proto__ || Object.getPrototypeOf(NewComponent)).call(this, props));

            _this.state = {
                userName: "",
                password: "",
                isLoading: false
            }
            return _this;
        }

        _createClass(NewComponent, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                  console.warn("Loaded successfully.... Thanks ....")  
            }
        }, {
            key: 'render',
            value: function render() {
                var _this = this;
                var localObject = this;

                var i = 1;
                var isAndroid = Platform.OS == "android" ? true : false

                return _react2.createElement(_reactNative.View, { style: styles.container },
                    [

                        _react2.createElement(Loader, { key: ++i, isLoading: _this.state.isLoading }
                            , [
                            ]),
                        _react2.createElement(_reactNative.View, { key: ++i, style: styles.mainContainer },
                            [
                                _react2.createElement(_reactNative.View, { key: ++i, style: styles.mainSubContainer },
                                    [
                                        // _react2.createElement(_reactNative.Text, { key: ++i, style: styles.labelText }, ["Change User ID"])
                                    ]
                                )
                            ]),
                        _react2.createElement(_reactNative.ScrollView, { key: ++i, style: styles.scrollView },
                            [
                                // inside the ScrollView 
                                _react2.createElement(_reactNative.View, { key: ++i }, [

                                    _react2.createElement(_reactNative.View, { key: ++i, style: styles.block }, [

                                        _react2.createElement(_reactNative.View, { key: ++i }, [
                                            _react2.createElement(_reactNative.View, {
                                                key: ++i, style: styles.usernameContainer
                                            },
                                                [
                                                    _react2.createElement(_reactNative.View, { key: ++i, style: styles.usernameSubcontainer }, [
                                                        // 
                                                        _react2.createElement(_reactNative.View, { key: ++i }, [
                                                            _react2.createElement(_reactNative.Text, { key: ++i, style: styles.colorBlue }, [
                                                                "UserName"
                                                            ])
                                                        ]),
                                                        _react2.createElement(_reactNative.View, { key: ++i, style: styles.usernameSubcontainer}, [
                                                            //
                                                            _react2.createElement(_reactNative.TextInput, {
                                                                key: ++i, style: styles.textInput,
                                                                onChangeText: function (val) {
                                                                    _this.setState({ userName: val })
                                                                },
                                                            }, [
                                                                    _this.state.userName
                                                                ])
                                                        ])
                                                    ])
                                                    ,
                                                    _react2.createElement(_reactNative.View, { key: ++i, style: styles.usernameSubcontainer }, [
                                                        // 
                                                        _react2.createElement(_reactNative.View, { key: ++i }, [
                                                            _react2.createElement(_reactNative.Text, { key: ++i, style: styles.colorBlue }, [
                                                                "Password"
                                                            ])
                                                        ]),
                                                        _react2.createElement(_reactNative.View, { key: ++i, style: styles.passwordContainer}, [
                                                            //
                                                            _react2.createElement(_reactNative.TextInput, {
                                                                key: ++i, style: styles.textInput
                                                                , onChangeText: function (val) {
                                                                    _this.setState({ password: val })
                                                                },
                                                            },
                                                                [
                                                                    _this.state.password
                                                                ])
                                                        ])
                                                    ])

                                                ]),
                                            _react2.createElement(_reactNative.View, { key: ++i, style: styles.saveButtonContainer }, [

                                                _react2.createElement(_reactNative.View, { key: ++i, style: styles.saveButtonSubContainer}, [
                                                    // 
                                                    _react2.createElement(_reactNative.View, { key: ++i }, [
                                                        _react2.createElement(Button, {
                                                            key: ++i, style: styles.saveButton,
                                                            onPress: function () {
                                                                changeUserIdPost(localObject);
                                                            }
                                                        }, [
                                                                "Save Changes",

                                                            ])
                                                    ])
                                                ])
                                            ])
                                        ])
                                    ])
                                ]),
                            ])
                    ]
                )

            }
        }]);

        return NewComponent;
    }(_react2.Component);

    return NewComponent
})
