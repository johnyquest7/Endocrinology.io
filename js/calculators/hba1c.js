// Glucose Converter Module
class GlucoseConverter {
    constructor() {
        this.name = 'Glucose Converter';
        this.description = 'Convert between Blood Glucose, HbA1c, and Fructosamine';
    }

    // Conversion functions
    calculateFromHbA1c(hba1c) {
        const glucose = ((hba1c * 28.7) - 46.7);
        const fructosamine = ((hba1c - 1.61) * 58.82);
        return {
            glucose: Math.round(glucose),
            fructosamine: parseFloat(fructosamine.toFixed(2))
        };
    }

    calculateFromFructosamine(fructosamine) {
        const hba1c = ((0.017 * fructosamine) + 1.61);
        const glucose = ((hba1c * 28.7) - 46.7);
        return {
            glucose: Math.round(glucose),
            hba1c: parseFloat(hba1c.toFixed(2))
        };
    }

    calculateFromGlucose(glucose) {
        const hba1c = ((glucose + 46.7) / 28.7);
        const fructosamine = ((hba1c - 1.61) * 58.82);
        return {
            hba1c: parseFloat(hba1c.toFixed(2)),
            fructosamine: parseFloat(fructosamine.toFixed(2))
        };
    }

    render(container) {
        container.innerHTML = `
            <div class="converter glucose-converter">
                <h2>${this.name}</h2>
                <p>${this.description}</p>
                
                <div class="converter-form">
                    <div class="form-group">
                        <label for="glucose">Blood Glucose (mg/dL)</label>
                        <input type="number" id="glucose" step="1" min="0" placeholder="Enter blood glucose">
                    </div>
                    
                    <div class="form-group">
                        <label for="hba1c">HbA1c (%)</label>
                        <input type="number" id="hba1c" step="0.1" min="0" placeholder="Enter HbA1c">
                    </div>
                    
                    <div class="form-group">
                        <label for="fructosamine">Fructosamine (μmol/L)</label>
                        <input type="number" id="fructosamine" step="0.01" min="0" placeholder="Enter fructosamine">
                    </div>
                </div>
                
                <div id="error-message" class="error-message" style="color: red; display: none;"></div>
            </div>

            <style>
                .glucose-converter {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .converter-form {
                    margin-top: 20px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                input[type="number"] {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                }
                .error-message {
                    margin-top: 10px;
                    padding: 10px;
                    border-radius: 4px;
                }
            </style>
        `;

        // Get form elements
        const glucoseInput = container.querySelector('#glucose');
        const hba1cInput = container.querySelector('#hba1c');
        const fructosamineInput = container.querySelector('#fructosamine');
        const errorMessage = container.querySelector('#error-message');

        let isUpdating = false;

        // Helper function to handle errors
        const showError = (message) => {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        };

        // Helper function to clear error
        const clearError = () => {
            errorMessage.style.display = 'none';
        };

        // Glucose input handler
        glucoseInput.addEventListener('input', () => {
            if (isUpdating) return;
            isUpdating = true;
            clearError();

            try {
                const glucose = parseFloat(glucoseInput.value);
                if (glucose && glucose > 0) {
                    const results = this.calculateFromGlucose(glucose);
                    hba1cInput.value = results.hba1c;
                    fructosamineInput.value = results.fructosamine;
                } else {
                    hba1cInput.value = '';
                    fructosamineInput.value = '';
                }
            } catch (error) {
                showError('Invalid glucose value');
            }

            isUpdating = false;
        });

        // HbA1c input handler
        hba1cInput.addEventListener('input', () => {
            if (isUpdating) return;
            isUpdating = true;
            clearError();

            try {
                const hba1c = parseFloat(hba1cInput.value);
                if (hba1c && hba1c > 0) {
                    const results = this.calculateFromHbA1c(hba1c);
                    glucoseInput.value = results.glucose;
                    fructosamineInput.value = results.fructosamine;
                } else {
                    glucoseInput.value = '';
                    fructosamineInput.value = '';
                }
            } catch (error) {
                showError('Invalid HbA1c value');
            }

            isUpdating = false;
        });

        // Fructosamine input handler
        fructosamineInput.addEventListener('input', () => {
            if (isUpdating) return;
            isUpdating = true;
            clearError();

            try {
                const fructosamine = parseFloat(fructosamineInput.value);
                if (fructosamine && fructosamine > 0) {
                    const results = this.calculateFromFructosamine(fructosamine);
                    glucoseInput.value = results.glucose;
                    hba1cInput.value = results.hba1c;
                } else {
                    glucoseInput.value = '';
                    hba1cInput.value = '';
                }
            } catch (error) {
                showError('Invalid fructosamine value');
            }

            isUpdating = false;
        });
    }
}

// Export the module
export default GlucoseConverter;
