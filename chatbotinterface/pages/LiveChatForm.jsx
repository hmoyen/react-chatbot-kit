import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket"; // Import socket instance
import "../styles/global.css"; // Ensure global styles are imported
import "../styles/Home.css";

export default function LiveChatForm() {
  const [formData, setFormData] = useState({
    role: "customer", // Default role
    name: "",
    issue: "",
    machine: "",
    priority: "Medium", // Default priority
    expertise: "", // For technicians
    availability: "", // For technicians
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.role === "customer") {
      // Emit customer data and navigate to live chat
      socket.emit("joinLiveChatQueue", {
        name: formData.name,
        issue: formData.issue,
        machine: formData.machine,
        priority: formData.priority,
      });
      navigate("/livechat", { state: { role: "customer", ...formData } });
    } else if (formData.role === "technician") {
      // Emit technician data and navigate to technician dashboard
      if (!formData.expertise || !formData.availability) {
        alert("Please fill out all fields for technician registration.");
        return;
      }
      socket.emit("registerTechnician", {
        name: formData.name,
        expertise: formData.expertise,
        availability: formData.availability,
      });
      navigate("/technician", { state: { role: "technician", ...formData } });
    }
  };

  return (
    <div className="container">
      <main className="main-content">
        <h1>Live Chat Form</h1>
        <p>Fill out the form below to start a live chat or register as a technician.</p>
        <form className="assistant-form" onSubmit={handleSubmit}>
          {/* Role Selector */}
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="customer">Customer</option>
            <option value="technician">Technician</option>
          </select>

          {/* Common Fields */}
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          {/* Customer-Specific Fields */}
          {formData.role === "customer" && (
            <>
              <input
                type="text"
                name="issue"
                placeholder="Describe your issue"
                value={formData.issue}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="machine"
                placeholder="Machine Type"
                value={formData.machine}
                onChange={handleInputChange}
                required
              />
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </>
          )}

          {/* Technician-Specific Fields */}
          {formData.role === "technician" && (
            <>
              <input
                type="text"
                name="expertise"
                placeholder="Your Expertise (e.g., Engine Repair)"
                value={formData.expertise}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="availability"
                placeholder="Your Availability (e.g., 9 AM - 5 PM)"
                value={formData.availability}
                onChange={handleInputChange}
                required
              />
            </>
          )}

          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  );
}
