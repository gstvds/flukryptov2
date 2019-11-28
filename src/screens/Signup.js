import React, { useReducer, useEffect, useCallback, useState } from "react";
import {
  View,
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

const SignupScreen = props => {
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

  const signupHandler = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        authActions.signup(
          formState.inputValues.email,
          formState.inputValues.password
        )
      );
      props.navigation.navigate("Login");
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
      <Card style={styles.signupContainer}>
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
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <Button
                title="Criar Conta"
                color={Colors.primary}
                onPress={signupHandler}
              />
            )}
          </View>
        </ScrollView>
      </Card>
    </KeyboardAvoidingView>
  );
};

SignupScreen.navigationOptions = {
  headerTitle: "Criar Conta"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333"
  },
  signupContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default SignupScreen;
