import React, { useRef } from 'react'

const OTP = ({ value, onChange }) => {

    const inputRefs = useRef([]);

    const updateOTP = (otp) => onChange?.(otp.slice(0, 6));

    const handleChange = (e, index) => {
        const digit = e.target.value.replace(/\D/g, "");
        const otp = value.split("");
        otp[index] = digit;

        updateOTP(otp.join(""));
        digit && inputRefs.current[index + 1]?.focus();
    }

    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && index > 0 && !value[index]) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const otp = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        updateOTP(otp);
        inputRefs.current[otp.length - 1]?.focus();
    }

    return (
        <div className="flex gap-2 sm:gap-3 justify-center items-center">
            {[...Array(6)].map((_, index) => (
                <input
                    key={index}
                    type="text"
                    required
                    value={value[index] || ''}
                    maxLength='1'
                    ref={e => inputRefs.current[index] = e}
                    onChange={e => handleChange(e, index)}
                    onKeyDown={e => handleBackspace(e, index)}
                    onPaste={handlePaste}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white text-gray-800 caret-blue-500"
                    autoComplete="off"
                />
            ))}
        </div>
    )
}

export default OTP