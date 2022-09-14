import React, { useEffect, useState } from "react";
import LoanJS from "loanjs";
import "./CalculateLoan.css";


const getLocaleItems=()=>{
  let list = localStorage.getItem('datas');
  // console.log(list);
  if(!list) return{
      "loan_amount":0,
      "loan_term":0,
      "interest_rate":0,
  }
      return JSON.parse(list);      
  }

const CalculateLoan = () => {

  const [history,setHistory]=useState([getLocaleItems()])

  const [values, setValues] = useState({
    loan_amount: 0,
    loan_term: 0,
    interest_rate: 0,
  });
  const [installments, setInstallments] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    calculate(
      values["loan_amount"],
      values["loan_term"],
      values["interest_rate"]
    );
  };

  const calculate = (amount, years, rate) => {
    var loan = new LoanJS.Loan(amount, years * 12, rate);
    setInstallments(loan.installments);
    // console.log(installments)
  };
  
  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  useEffect(() => {
    localStorage.setItem('datas',JSON.stringify(values))
  }, [values])

  return (
    <div>
      <div className="loan_calculator_container">
        <h1>Loan Calculator</h1>
        <form onSubmit={handleSubmit}>
          <div className="form_item">
            <label htmlFor="loan_amount">Loan Amount</label>
            <div className="form_input">
              <input
                type="number"
                name="loan_amount"
                placeholder="0"
                value={values["loan_amount"]}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form_item">
            <label htmlFor="interest_rate">Interest Rate</label>
            <div className="form_input">
              <input
                type="number"
                name="interest_rate"
                placeholder="0"
                value={values["interest_rate"]}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form_item">
            <label htmlFor="loan_term">Loan Term (Years)</label>
            <div className="form_input">
              <input
                type="number"
                name="loan_term"
                placeholder="0"
                value={values["loan_term"]}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form_action">
            <input
              type="submit"
              value="Calculate"
              className="calculate_button"
            />
          </div>
        </form>

        {!!installments?.length && (
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Payment Amount</th>
                <th>Interest Paid</th>
                <th>Principal Paid</th>
                <th>Remain</th>
              </tr>
            </thead>
            <tbody>
              {installments.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{roundToTwo(item.installment)}</td>
                    <td>{roundToTwo(item.interest)}</td>
                    <td>{roundToTwo(item.capital)}</td>
                    <td>{roundToTwo(item.remain)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CalculateLoan;