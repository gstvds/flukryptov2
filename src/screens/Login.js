import React, { useReducer, useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Button,
  Alert,
  ActivityIndicator
} from "react-native";
import { useDispatch } from "react-redux";

import Card from "../components/Card";
import Input from "../components/Input";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const LoginScreen = props => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: ""
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert("Opa, aconteceu algo de errado", error, [{ text: "Ok" }]);
    }
  }, [error]);

  const loginHandler = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        authActions.login(
          formState.inputValues.email,
          formState.inputValues.password
        )
      );
      props.navigation.navigate("Main");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={25}
      style={styles.container}
    >
      <Card style={styles.loginContainer}>
        <ScrollView>
          <Input
            id="email"
            label="e-mail"
            keyboardType="email-address"
            required
            email
            autoCapitalize="none"
            initialValue=""
            onInputChange={inputChangeHandler}
          />
          <Input
            id="password"
            label="password"
            keyboardType="default"
            required
            minLength={5}
            autoCapitalize="none"
            initialValue=""
            onInputChange={inputChangeHandler}
            secureTextEntry
          />
          <View style={styles.buttons}>
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
              ) : (
                <Button
                  title="Login"
                  color={Colors.primary}
                  onPress={loginHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate("Signup");
                }}
              >
                <Text>
                  Não possui conta ainda?{" "}
                  <Text style={{ color: Colors.primary }}>Criar uma</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Card>
    </KeyboardAvoidingView>
  );
};

LoginScreen.navigationOptions = {
  headerTitle: "Login"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loginContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttons: {
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default LoginScreen;
