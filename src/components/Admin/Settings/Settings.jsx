import "./Settings.css";

import { useState, useEffect } from "react";

import { useSettings } from "../../../context/SettingsContext";
import Toast from "../../../components/Toast/Toast";

export default function Settings() {

    const { settings, updateSettings } = useSettings();

    const [form, setForm] = useState(settings);
    const [showToast, setShowToast] = useState(false);

    // Si settings cambia desde afuera (ej. se cargó de localStorage
    // después del primer render), reflejarlo en el formulario.
    useEffect(() => {
        setForm(settings);
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {

        e.preventDefault();

        updateSettings(form);

        setShowToast(true);

        setTimeout(() => setShowToast(false), 1500);

    };

    return (

        <section className="settings">

            <h1>Ajustes</h1>

            <p className="settings__subtitle">
                Información general de tu negocio.
            </p>

            <form className="settings__form" onSubmit={handleSave}>

                <div className="settings__block">

                    <h3>Negocio</h3>

                    <div className="settings__group">
                        <label>Nombre del negocio</label>
                        <input
                            type="text"
                            name="businessName"
                            value={form.businessName}
                            onChange={handleChange}
                            placeholder="Ej. Kopi Coffee"
                        />
                    </div>

                    <div className="settings__row">

                        <div className="settings__group">
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Ej. 633 123 4567"
                            />
                        </div>

                        <div className="settings__group">
                            <label>Moneda</label>
                            <input
                                type="text"
                                name="currency"
                                value={form.currency}
                                onChange={handleChange}
                                placeholder="Ej. $"
                                maxLength={3}
                            />
                        </div>

                    </div>

                    <div className="settings__group">
                        <label>Dirección</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Ej. Calle Falsa 123, Agua Prieta, Son."
                        />
                    </div>

                </div>

                <div className="settings__block">

                    <h3>Horario</h3>

                    <div className="settings__row">

                        <div className="settings__group">
                            <label>Abre</label>
                            <input
                                type="time"
                                name="openTime"
                                value={form.openTime}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="settings__group">
                            <label>Cierra</label>
                            <input
                                type="time"
                                name="closeTime"
                                value={form.closeTime}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                </div>

                <button type="submit" className="settings__button">
                    Guardar cambios
                </button>

            </form>

            <Toast
                message="Ajustes guardados ✅"
                type="success"
                isVisible={showToast}
            />

        </section>
    );
}