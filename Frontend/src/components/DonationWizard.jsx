import React, { useState, useEffect } from "react";
import apiClient from "../hooks/apiClient";
import { debounce } from "lodash";

const FloatingLabelInput = ({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  error,
  containerClass = "",
  required = false,
  disabled = false,
  ...props
}) => {
  const floatLabel = value && !error;
  const hasError = Boolean(error);

  return (
    <div className={`relative mt-6 ${containerClass}`}>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all ${
          hasError
            ? "border-[#F4B5AE] focus:ring-[#F7CDC7]"
            : "border-gray-300 focus:border-[#1598D2] focus:ring-[#6BDCF6]"
        } ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        required={required}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none font-medium ${
          floatLabel ? "text-xs -top-2 px-1 bg-white" : "text-base top-3"
        } ${hasError ? "text-[#F4B5AE]" : "text-gray-500"} ${
          disabled ? "opacity-70" : ""
        }`}
      >
        {label} {required && <span className="text-[#F4B5AE]">*</span>}
      </label>
      {hasError && (
        <p id={`${id}-error`} className="mt-1 text-sm text-[#F4B5AE]">
          {error}
        </p>
      )}
    </div>
  );
};

const DonationWizard = ({ projectId }) => {
  // 1️⃣ Detect JWT in localStorage
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);
  if (isAuthenticated) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // start on Step 2 if logged in
  const [step, setStep] = useState(isAuthenticated ? 2 : 1);
  const [donationType, setDonationType] = useState("once");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    governorate_id: "",
    onceAmount: 50,
    customOnceAmount: "",
    startDate: "",
    endDate: "",
    recurringAmount: "",
    interval: "",
    paymentMethod: "card",
    cardFirstName: "",
    cardLastName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    paypalEmail: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    success: false,
  });
  const [governorates, setGovernorates] = useState([]);
  const [donationFrequencies, setDonationFrequencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // Fetch reference data
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        setIsLoading(true);
        const { data: govData } = await apiClient.get(
          "/reference-data/governate"
        );
        setGovernorates(govData);
        const { data: freqData } = await apiClient.get(
          "/reference-data/intervel_type"
        );
        setDonationFrequencies(freqData);
        if (freqData.length) {
          setFormData((p) => ({ ...p, interval: freqData[0].id }));
        }
      } catch (err) {
        console.error(err);
        setNotification({
          show: true,
          message: "Failed to load form data.",
          success: false,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchReferenceData();
  }, []);

  // Check donor info by email
  const checkDonorInfo = async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    try {
      setIsCheckingEmail(true);
      const { data } = await apiClient.get(
        `/donate-without-account/getBasicDonorInfo?email=${encodeURIComponent(
          email
        )}`
      );

      if (data) {
        setFormData((prev) => ({
          ...prev,
          username: data.user_name || prev.username,
          phone: data.phone || prev.phone,
          governorate_id: data.governorate_id || prev.governorate_id,
          // Keep the existing email in case the API returns a different one
          email: prev.email,
        }));
      }
    } catch (err) {
      console.error("Error fetching donor info:", err);
      // Don't show error if it's a 404 (not found is expected)
      if (err.response?.status !== 404) {
        setNotification({
          show: true,
          message: "Error checking donor information",
          success: false,
        });
      }
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Validation per-step
  const validateStep = (current) => {
    const newErrors = {};
    if (current === 1 && !isAuthenticated) {
      if (!formData.username.trim()) newErrors.username = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email";
      if (!formData.governorate_id)
        newErrors.governorate_id = "Select governorate";
    }
    if (current === 2) {
      if (donationType === "once") {
        const amt = formData.customOnceAmount || formData.onceAmount;
        if (!amt || isNaN(amt) || amt <= 0) newErrors.amount = "Invalid amount";
      } else {
        if (!formData.startDate) newErrors.startDate = "Start date required";
        if (
          !formData.recurringAmount ||
          isNaN(formData.recurringAmount) ||
          formData.recurringAmount <= 0
        )
          newErrors.recurringAmount = "Invalid amount";
        if (!formData.interval) newErrors.interval = "Select frequency";
      }
    }
    if (current === 3) {
      if (formData.paymentMethod === "card") {
        if (!formData.cardFirstName.trim())
          newErrors.cardFirstName = "Required";
        if (!formData.cardLastName.trim()) newErrors.cardLastName = "Required";
        if (
          !formData.cardNumber ||
          formData.cardNumber.replace(/\s/g, "").length < 16
        )
          newErrors.cardNumber = "Invalid number";
        if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry))
          newErrors.cardExpiry = "Invalid expiry";
        if (!formData.cardCVC || formData.cardCVC.length < 3)
          newErrors.cardCVC = "Invalid CVC";
      } else {
        if (!formData.paypalEmail)
          newErrors.paypalEmail = "PayPal email required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.paypalEmail))
          newErrors.paypalEmail = "Invalid email";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };
  const prevStep = () => setStep((s) => s - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleDonationTypeToggle = (type, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDonationType(type);
    setFormData((p) => ({
      ...p,
      onceAmount: 50,
      customOnceAmount: "",
      startDate: "",
      endDate: "",
      recurringAmount: "",
      interval: donationFrequencies[0]?.id || "",
    }));
  };

  const formatCardNumber = (v) =>
    v
      .replace(/\s?/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amt);

  // Final submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    setIsSubmitting(true);

    try {
      const paymentMethodCode = formData.paymentMethod === "paypal" ? 31 : 32;

      // Build payload
      const baseData = {
        paymentMethod: paymentMethodCode,
        ...(projectId ? { project_id: projectId } : {}),
      };
      const amountData =
        donationType === "once"
          ? { amount: formData.customOnceAmount || formData.onceAmount }
          : {
              start_date: formData.startDate,
              end_date: formData.endDate || null,
              intervel_type: parseInt(formData.interval, 10),
              intervel_amount: parseFloat(formData.recurringAmount),
            };
      const paymentData =
        formData.paymentMethod === "card"
          ? {
              cardFirstName: formData.cardFirstName,
              cardLastName: formData.cardLastName,
              cardNumber: formData.cardNumber.replace(/\s/g, ""),
              cardExpiry: formData.cardExpiry,
              cardCVC: formData.cardCVC,
            }
          : { paypalEmail: formData.paypalEmail };

      const guestData = isAuthenticated
        ? {}
        : {
            user_name: formData.username.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            governorate_id: formData.governorate_id,
          };

      const donationData = {
        ...guestData,
        ...baseData,
        ...amountData,
        ...paymentData,
      };

      // Choose endpoint
      const endpoint =
        donationType === "once"
          ? isAuthenticated
            ? "/donate/once"
            : "/donate-without-account/onceDonation"
          : isAuthenticated
          ? "/donate/recurring"
          : "/donate-without-account/recurringDonation";

      const res = await apiClient.post(endpoint, donationData);
      const { message, transaction } = res.data;

      setNotification({
        show: true,
        message:
          message +
          (transaction?.transaction_code
            ? ` Code: ${transaction.transaction_code}.`
            : ""),
        success: true,
      });

      // Reset only guest fields
      if (!isAuthenticated) {
        setFormData({
          username: "",
          email: "",
          phone: "",
          governorate_id: "",
          onceAmount: 50,
          customOnceAmount: "",
          startDate: "",
          endDate: "",
          recurringAmount: "",
          interval: donationFrequencies[0]?.id || "",
          paymentMethod: "card",
          cardFirstName: "",
          cardLastName: "",
          cardNumber: "",
          cardExpiry: "",
          cardCVC: "",
          paypalEmail: "",
        });
        setStep(1);
      } else {
        // Auth users stay on donation step
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      setNotification({
        show: true,
        message:
          err.response?.data?.message ||
          err.message ||
          "Error processing donation.",
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-hide notification
  useEffect(() => {
    if (notification.show) {
      const t = setTimeout(
        () => setNotification((p) => ({ ...p, show: false })),
        5000
      );
      return () => clearTimeout(t);
    }
  }, [notification]);

  const predefinedAmounts = [50, 100, 150, 200];

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-xl shadow-lg text-center">
        <svg
          className="animate-spin h-8 w-8 text-[#1598D2] mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.29A7.962 7.962 0 014 
12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="mt-4 text-gray-600">Loading form…</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md shadow-md text-white ${
            notification.success ? "bg-[#1598D2]" : "bg-[#F4B5AE]"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Steps indicator */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-200 -z-10" />
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                step >= n
                  ? "bg-[#1598D2] border-[#1598D2] text-white"
                  : "bg-white border-gray-300 text-gray-500"
              }`}
            >
              {n}
            </div>
            <span
              className={`text-xs mt-1 ${
                step >= n ? "text-[#1598D2] font-medium" : "text-gray-500"
              }`}
            >
              {n === 1
                ? isAuthenticated
                  ? "Donation"
                  : "Your Info"
                : n === 2
                ? "Donation"
                : "Payment"}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Guest Info */}
      {!isAuthenticated && step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            Your Information
          </h2>
          <FloatingLabelInput
            id="email"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={debounce((e) => checkDonorInfo(e.target.value), 500)}
            error={errors.email}
            required
            disabled={isCheckingEmail}
          />
          {isCheckingEmail && (
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <svg
                className="animate-spin h-4 w-4 mr-2 text-[#1598D2]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.29A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Checking donor information...
            </div>
          )}
          <FloatingLabelInput
            id="username"
            label="Full Name"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />
          <FloatingLabelInput
            id="phone"
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />
          <div className="mt-6">
            <select
              name="governorate_id"
              value={formData.governorate_id}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                errors.governorate_id
                  ? "border-[#F4B5AE] focus:ring-[#F7CDC7]"
                  : "border-gray-300 focus:border-[#1598D2] focus:ring-[#6BDCF6]"
              }`}
            >
              <option value="">Select Governorate</option>
              {governorates.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.value}
                </option>
              ))}
            </select>
            {errors.governorate_id && (
              <p className="mt-1 text-sm text-[#F4B5AE]">
                {errors.governorate_id}
              </p>
            )}
          </div>
          <button
            onClick={nextStep}
            className="w-full mt-6 py-3 bg-[#1598D2] hover:bg-[#2DC5F2] text-white font-medium rounded-lg"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Amount / Schedule */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            {donationType === "once" ? "Donation Amount" : "Recurring Donation"}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {donationType === "once"
              ? "Select or enter an amount."
              : "Set your schedule."}
          </p>

          <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-6">
            {["once", "recurring"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={(e) => handleDonationTypeToggle(t, e)}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  donationType === t
                    ? "bg-[#1598D2] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {t === "once" ? "ONE-TIME" : "RECURRING"}
              </button>
            ))}
          </div>

          {donationType === "once" ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {predefinedAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        onceAmount: amt,
                        customOnceAmount: "",
                      }))
                    }
                    className={`py-3 rounded-lg border transition-colors ${
                      formData.onceAmount === amt && !formData.customOnceAmount
                        ? "bg-[#1598D2] text-white border-[#1598D2]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>
              <FloatingLabelInput
                id="customOnceAmount"
                label="Other Amount"
                type="number"
                name="customOnceAmount"
                value={formData.customOnceAmount}
                onChange={handleChange}
                error={errors.amount}
                min="1"
                step="0.01"
              />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingLabelInput
                  id="startDate"
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  error={errors.startDate}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
                <FloatingLabelInput
                  id="endDate"
                  label="End Date (opt)"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={errors.endDate}
                  min={
                    formData.startDate || new Date().toISOString().split("T")[0]
                  }
                />
              </div>
              <FloatingLabelInput
                id="recurringAmount"
                label="Amount"
                type="number"
                name="recurringAmount"
                value={formData.recurringAmount}
                onChange={handleChange}
                error={errors.recurringAmount}
                required
                min="1"
                step="0.01"
              />
              <div className="relative mt-6">
                <select
                  id="interval"
                  name="interval"
                  value={formData.interval}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 appearance-none ${
                    errors.interval
                      ? "border-[#F4B5AE] focus:ring-[#F7CDC7]"
                      : "border-gray-300 focus:border-[#1598D2] focus:ring-[#6BDCF6]"
                  }`}
                  style={{ height: "3.5rem" }}
                  required
                >
                  {donationFrequencies.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.value}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="interval"
                  className={`absolute left-3 transition-all duration-200 pointer-events-none font-medium ${
                    formData.interval
                      ? "text-xs -top-2 px-1 bg-white"
                      : "text-base top-3"
                  } ${errors.interval ? "text-[#F4B5AE]" : "text-gray-500"}`}
                >
                  Frequency <span className="text-[#F4B5AE]">*</span>
                </label>
                {errors.interval && (
                  <p className="mt-1 text-sm text-[#F4B5AE]">
                    {errors.interval}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-[#1598D2] hover:bg-[#2DC5F2] text-white rounded-lg"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            Payment Information
          </h2>
          <div className="flex justify-center space-x-8 mb-6 border-b border-gray-200 pb-4">
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({ ...p, paymentMethod: "card" }))
              }
              className={`pb-2 border-b-2 transition-colors font-medium ${
                formData.paymentMethod === "card"
                  ? "border-[#1598D2] text-[#1598D2]"
                  : "border-transparent text-gray-700 hover:text-[#2DC5F2]"
              }`}
            >
              Card
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((p) => ({ ...p, paymentMethod: "paypal" }))
              }
              className={`pb-2 border-b-2 transition-colors font-medium ${
                formData.paymentMethod === "paypal"
                  ? "border-[#1598D2] text-[#1598D2]"
                  : "border-transparent text-gray-700 hover:text-[#2DC5F2]"
              }`}
            >
              PayPal
            </button>
          </div>

          {formData.paymentMethod === "card" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabelInput
                  id="cardFirstName"
                  label="First Name on Card"
                  name="cardFirstName"
                  value={formData.cardFirstName}
                  onChange={handleChange}
                  error={errors.cardFirstName}
                  required
                />
                <FloatingLabelInput
                  id="cardLastName"
                  label="Last Name on Card"
                  name="cardLastName"
                  value={formData.cardLastName}
                  onChange={handleChange}
                  error={errors.cardLastName}
                  required
                />
              </div>
              <FloatingLabelInput
                id="cardNumber"
                label="Card Number"
                name="cardNumber"
                value={formatCardNumber(formData.cardNumber)}
                onChange={(e) => {
                  const v = e.target.value.replace(/\s/g, "");
                  if (v === "" || /^\d+$/.test(v)) {
                    handleChange({ target: { name: "cardNumber", value: v } });
                  }
                }}
                maxLength={19}
                error={errors.cardNumber}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <FloatingLabelInput
                  id="cardExpiry"
                  label="Expiry (MM/YY)"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "");
                    if (v.length <= 4) {
                      if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                      handleChange({
                        target: { name: "cardExpiry", value: v },
                      });
                    }
                  }}
                  maxLength={5}
                  error={errors.cardExpiry}
                  required
                />
                <FloatingLabelInput
                  id="cardCVC"
                  label="CVC"
                  name="cardCVC"
                  type="password"
                  value={formData.cardCVC}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    if (v.length <= 4) {
                      handleChange({ target: { name: "cardCVC", value: v } });
                    }
                  }}
                  maxLength={4}
                  error={errors.cardCVC}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <FloatingLabelInput
                id="paypalEmail"
                label="PayPal Email"
                type="email"
                name="paypalEmail"
                value={formData.paypalEmail}
                onChange={handleChange}
                error={errors.paypalEmail}
                required
              />
              <div className="bg-[#6BDCF6] bg-opacity-20 p-4 rounded-lg">
                <p className="text-gray-700">
                  You'll be redirected to PayPal to complete payment.
                </p>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">Donation Summary</h3>
            <p className="text-gray-600">
              {donationType === "once" ? (
                <>
                  One-time:{" "}
                  <span className="font-medium">
                    {formatCurrency(
                      formData.customOnceAmount || formData.onceAmount
                    )}
                  </span>
                </>
              ) : (
                <>
                  Recurring:{" "}
                  <span className="font-medium">
                    {formatCurrency(formData.recurringAmount)}{" "}
                    {donationFrequencies
                      .find((f) => f.id === formData.interval)
                      ?.value.toLowerCase()}
                  </span>
                </>
              )}
            </p>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#1598D2] hover:bg-[#2DC5F2] text-white rounded-lg disabled:opacity-70 flex items-center"
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.29A7.962 7.962 0 014 
12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                Complete Donation
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default DonationWizard;
