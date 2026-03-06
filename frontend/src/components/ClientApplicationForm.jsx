import React, { useState } from "react";
import { createApplication } from "../../api/applications.js";

const ClientApplicationForm = () => {
  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    room: "",
    time: "",
  });

  const formatKZPhone = (value) => {
    const digits = String(value || "").replace(/\D/g, "");

    // хотим: 7 + 10 цифр
    let d = digits;

    // Если начали с 8/7/ +7 — приводим к виду 7XXXXXXXXXX
    if (d.startsWith("8")) d = "7" + d.slice(1);
    if (!d.startsWith("7")) d = "7" + d;

    d = d.slice(0, 11); // максимум 11 цифр (7 + 10)

    const cc = "+7";
    const a = d.slice(1, 4); // 3 цифры
    const b = d.slice(4, 7); // 3
    const c = d.slice(7, 11); // 4

    if (d.length <= 1) return cc;
    if (d.length <= 4) return `${cc} (${a}`;
    if (d.length <= 7) return `${cc} (${a}) ${b}`;
    return `${cc} (${a}) ${b} ${c.slice(0, 4)}`;
  };

  const kzPhoneToDigits = (formatted) =>
    String(formatted || "").replace(/\D/g, "");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setForm((p) => ({ ...p, phone: formatKZPhone(value) }));
      setErrors((p) => ({ ...p, phone: "" }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const digits = kzPhoneToDigits(form.phone);
    if (digits.length !== 11 || !digits.startsWith("7")) {
      e.phone = "Enter valid KZ phone: +7 (XXX) XXX XXXX";
    }
    const e = {};
    if (!form.clientName.trim()) e.clientName = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.room.trim()) e.room = "Room is required";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      setLoading(true);
      setSuccessId(null);
      const digits = kzPhoneToDigits(form.phone);
      const phoneE164 = `+${digits}`;
      const payload = {
        clientName: form.clientName.trim(),
        phone: phoneE164,
        room: form.room.trim(),
        ...(form.time ? { time: new Date(form.time).toISOString() } : {}),
      };

      const created = await createApplication(payload);
      setSuccessId(created?.id ?? true);

      setForm({ clientName: "", phone: "", room: "", time: "" });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || "Failed to create application";
      setErrors((p) => ({ ...p, submit: msg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-form-wrap">
      <div className="client-card">
        <div className="client-header">
          <h1 className="client-title">Leave an application</h1>
          <p className="client-subtitle">
            Fill the form and our admin will process it.
          </p>
        </div>

        {successId && (
          <div className="client-success">
            ✅ Application submitted
            {typeof successId === "number" ? ` (#${successId})` : ""}!
          </div>
        )}

        {errors.submit && <div className="client-error">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="input-group">
            <label className="input-label" htmlFor="clientName">
              Name
            </label>
            <input
              id="clientName"
              name="clientName"
              className={`input-field ${errors.clientName ? "error" : ""}`}
              value={form.clientName}
              onChange={handleChange}
              placeholder="Your name"
              disabled={loading}
            />
            {errors.clientName && (
              <span className="error-text">{errors.clientName}</span>
            )}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              className={`input-field ${errors.phone ? "error" : ""}`}
              value={form.phone}
              onChange={handleChange}
              placeholder="+7 (777) 123 1234"
              disabled={loading}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="room">
              Room / Address
            </label>
            <input
              id="room"
              name="room"
              className={`input-field ${errors.room ? "error" : ""}`}
              value={form.room}
              onChange={handleChange}
              placeholder="H401 / Street, house..."
              disabled={loading}
            />
            {errors.room && <span className="error-text">{errors.room}</span>}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="time">
              Preferred time (optional)
            </label>
            <input
              type="datetime-local"
              id="time"
              name="time"
              className="input-field"
              value={form.time}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button className="signin-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientApplicationForm;
