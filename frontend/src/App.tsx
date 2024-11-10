import React, { useEffect, useContext, useCallback } from "react";

import Header from "./Components/Headers";
import Products from "./Components/ProductTypes/Products";
import Items from "./Components/ProductTypes/Items";
import Context from "./Context";

import styles from "./App.module.scss";
import { CraCheckReportProduct } from "plaid";
import { StatisticsGrid } from "./Components/StatisticsGrid/StatisticsGrid";

const App = () => {
  const { linkSuccess, isPaymentInitiation, itemId, dispatch } =
    useContext(Context);

  const getInfo = useCallback(async () => {
    const response = await fetch("/api/info", { method: "POST" });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return { paymentInitiation: false };
    }
    const data = await response.json();
    const paymentInitiation: boolean =
      data.products.includes("payment_initiation");
    const craEnumValues = Object.values(CraCheckReportProduct);
    const isUserTokenFlow: boolean = data.products.some(
      (product: CraCheckReportProduct) => craEnumValues.includes(product)
    );
    const isCraProductsExclusively: boolean = data.products.every(
      (product: CraCheckReportProduct) => craEnumValues.includes(product)
    );
    dispatch({
      type: "SET_STATE",
      state: {
        products: data.products,
        isPaymentInitiation: paymentInitiation,
        isCraProductsExclusively: isCraProductsExclusively,
        isUserTokenFlow: isUserTokenFlow,
      },
    });
    return { paymentInitiation, isUserTokenFlow };
  }, [dispatch]);

  const generateUserToken = useCallback(async () => {
    const response = await fetch("api/create_user_token", { method: "POST" });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { userToken: null } });
      return;
    }
    const data = await response.json();
    if (data) {
      if (data.error != null) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: null,
            linkTokenError: data.error,
          },
        });
        return;
      }
      dispatch({ type: "SET_STATE", state: { userToken: data.user_token } });
      return data.user_token;
    }
  }, [dispatch]);

  const generateToken = useCallback(
    async (isPaymentInitiation) => {
      // Link tokens for 'payment_initiation' use a different creation flow in your backend.
      const path = isPaymentInitiation
        ? "/api/create_link_token_for_payment"
        : "/api/create_link_token";
      const response = await fetch(path, {
        method: "POST",
      });
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }
      const data = await response.json();
      if (data) {
        if (data.error != null) {
          dispatch({
            type: "SET_STATE",
            state: {
              linkToken: null,
              linkTokenError: data.error,
            },
          });
          return;
        }
        dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
      }
      // Save the link_token to be used later in the Oauth flow.
      localStorage.setItem("link_token", data.link_token);
    },
    [dispatch]
  );

  useEffect(() => {
    const init = async () => {
      const { paymentInitiation, isUserTokenFlow } = await getInfo(); // used to determine which path to take when generating token
      // do not generate a new token for OAuth redirect; instead
      // setLinkToken from localStorage
      if (window.location.href.includes("?oauth_state_id=")) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: localStorage.getItem("link_token"),
          },
        });
        return;
      }

      if (isUserTokenFlow) {
        await generateUserToken();
      }
      generateToken(paymentInitiation);
    };
    init();
  }, [dispatch, generateToken, generateUserToken, getInfo]);

  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <Header />
        {linkSuccess && (
          <>
            <StatisticsGrid />
            {/* <Products /> */}
            <p>
  The allocation of $153 or 153000 credit card points is based on a needs assessment that compares your financial profile—annual salary of $30,000, credit score of 570, monthly spending of $2,600, and outstanding debts of $10,000—to those of other individuals with varying financial situations.
</p>

<p>
  1. <strong>Income:</strong> With an annual salary of $30,000, you fall into a lower income bracket, which typically correlates with a higher need for support. Individuals with higher salaries generally have greater disposable income, reducing their perceived financial strain.
</p>

<p>
  2. <strong>Credit Score:</strong> A score of 570 is below the median, signaling financial instability or limited access to affordable credit. In comparison, applicants with higher scores often have better credit access and thus lower assessed need.
</p>

<p>
  3. <strong>Monthly Spending:</strong> Spending $2,600 monthly represents a high proportion of your income, limiting savings potential. In contrast, those with similar spending but higher income experience less financial stress, as they can manage such expenses more comfortably.
</p>

<p>
  4. <strong>Outstanding Debts:</strong> A debt burden of $10,000 places additional strain on your budget. Individuals with less debt or higher income have greater flexibility, making them less likely to require financial assistance.
</p>

<p>
  Each of these metrics positions you in a higher percentile of financial need. In comparison, individuals with higher income, better credit scores, lower debt, or a lower income-to-spending ratio are seen as less financially vulnerable, resulting in lower allocations. Thus, the $153 amount reflects the system’s evaluation of your financial constraints relative to those in more stable situations.
</p>
            {/* {!isPaymentInitiation && itemId && <Items />} */}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
