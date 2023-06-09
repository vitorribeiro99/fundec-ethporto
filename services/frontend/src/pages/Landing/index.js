/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// React
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import console from "console-browserify";

// Soft UI Dashboard PRO React components
import SoftBox from "components/atoms/SoftBox";
import SoftInput from "components/atoms/SoftInput";
import SoftButton from "components/atoms/SoftButton";

// Images
const curved9 = require("assets/images/curved9.jpg");

// Authentication layout components
import AuthCoverLayout from "components/organisms/LayoutContainers/CoverLayout/AuthCoverLayout";
import Header from "./Header";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { useSendCodeMutation, useVerifyCodeMutation } from "state/auth/authApiSlice";
import { setCredentials, selectUser } from "state/auth/authSlice";

// Others
import { validateEmail } from "utils/validations";

function validateCode(value) {
  return value.length == 40;
}
function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return {
        title: "Invest Locally, Impact Globally!",
        description: "Enter your email for a one time login code",
      };
    case 1:
      return {
        title: "Welcome",
        description: "Enter your email for a one time login code",
        placeholder: "Email",
        buttonText: "Send Link",
        validationFunction: validateEmail,
      };
    case 2:
      return {
        title: "Almost There",
        description: "Input the one-time login code that you received.",
        placeholder: "Login Code",
        buttonText: "Log In",
        validationFunction: validateCode,
      };
    default:
      return null;
  }
}

export default function Landing({ activeStepProp = 0 }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [activeStep, setActiveStep] = useState(activeStepProp);
  const [error, setError] = useState(undefined);

  const [
    sendCode,
    { isSuccess: isSuccessSend, isLoading: isLoadingSend, isError: isErrorSend, error: errorSend },
  ] = useSendCodeMutation();

  const [verifyCode, { isSuccess: isSuccessVerify, isError: isErrorVerify, error: errorVerify }] =
    useVerifyCodeMutation();

  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangeCode = (e) => setCode(e.target.value);

  const canSendEmail =
    !isLoadingSend && activeStep === 1 && getStepContent(activeStep)?.validationFunction(email);
  const canSendCode =
    !isLoadingSend && activeStep === 2 && getStepContent(activeStep)?.validationFunction(code);

  const onClickConfirm = async () => {
    switch (activeStep) {
      case 0:
        break;
      case 1:
        await sendCode({ email });
        break;
      case 2:
        const user = await verifyCode({ email, code }).unwrap();
        dispatch(setCredentials(user));
      default:
        return;
    }
  };

  useEffect(() => {
    switch (activeStep) {
      case 1:
        if (isSuccessSend) {
          setActiveStep(2);
        }
        break;
      case 2:
        if (isSuccessVerify) {
          navigate("/open-campaigns");
        }
        break;
      default:
        break;
    }
  }, [isSuccessSend, isSuccessVerify]);

  useEffect(() => {
    if (isErrorSend || isErrorVerify) {
      const errorResponse = errorSend ?? errorVerify;
      setError(
        (errorResponse?.data?.message ||
          (typeof errorResponse.data?.detail == String && errorResponse?.data?.detail) ||
          errorResponse?.error) ??
          "There has been an error. Please, try again later"
      );
    }
  }, [isErrorSend, isErrorVerify]);

  return (
    <AuthCoverLayout
      header={
        activeStep === 0 ? (
          <Header
            onSignup={() => {
              setActiveStep(1);
            }}
          />
        ) : (
          false
        )
      }
      title={getStepContent(activeStep).title}
      description={getStepContent(activeStep).description}
      image={curved9}
    >
      {activeStep > 0 && (
        <>
          <SoftBox display="flex" flexDirection="row" justifyContent="space-between">
            <SoftBox flexGrow={3} mr={1}>
              {activeStep === 1 ? (
                <SoftInput
                  type="email"
                  placeholder={getStepContent(activeStep).placeholder}
                  name="email"
                  onChange={onChangeEmail}
                  error={email.length > 0 ? !canSendEmail : null}
                  success={email.length > 0 ? canSendEmail : null}
                  defaultValue=""
                />
              ) : (
                <SoftInput
                  type="text"
                  placeholder={getStepContent(activeStep).placeholder}
                  name="code"
                  onChange={onChangeCode}
                  error={code.length > 0 ? !canSendCode : null}
                  success={code.length > 0 ? canSendCode : null}
                  defaultValue=""
                />
              )}
            </SoftBox>
            <SoftBox flexGrow={1}>
              <SoftButton
                variant="gradient"
                color="info"
                onClick={onClickConfirm}
                disabled={activeStep === 1 ? !canSendEmail : !canSendCode}
              >
                {getStepContent(activeStep).buttonText}
              </SoftButton>
            </SoftBox>
          </SoftBox>
          <SoftBox mt={2} mb={2} textAlign="center" marginRight={"184px"}>
            <h6
              style={{
                fontSize: ".7em",
                color: "red",
                textAlign: "center",
                fontWeight: 400,
                transition: ".2s all",
              }}
            >
              {error}
            </h6>
          </SoftBox>
        </>
      )}
    </AuthCoverLayout>
  );
}
