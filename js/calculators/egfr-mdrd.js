// eGFR Calculator Module using MDRD Formula
class EGFRCalculator {
    constructor() {
        this.name = 'eGFR Calculator';
        this.description = 'Calculate eGFR using MDRD (Modification of Diet in Renal Disease) formula';
    }

    // Convert μmol/L to mg/dL
    convertToMgDL(umolL) {
        return umolL * 0.0113;
    }

    // Calculate eGFR using MDRD formula
    calculateEGFR(creatinine, age, isFemale) {
        // MDRD formula: 175 × (Scr)^-1.154 × (Age)^-0.203 × (0.742 if female)
        let egfr = 175 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
        
        if (isFemale) {
            egfr *= 0.742;
        }
        
        return egfr;
    }

    // Get eGFR category
    getEGFRCategory(egfr) {
        if (egfr >= 90) return 'Stage 1 with normal or high GFR';
        if (egfr >= 60) return 'Stage 2 Mild CKD';
        if (egfr >= 45) return 'Stage 3A Moderate CKD';
        if (egfr >= 30) return 'Stage 3B Moderate CKD';
        if (egfr >= 15) return 'Stage 4 Severe CKD';
        return 'Stage 5 End Stage CKD';
    }

    render(container) {
        container.innerHTML = `
            <div class="calculator egfr-calculator">
                <h2>${this.name}</h2>
                <p>${this.description}</p>
                
                <form id="egfr-form" class="calculator-form">
                    <div class="form-group">
                        <label>Serum Creatinine</label>
                        <div class="input-group">
                            <input type="number" id="creatinine" step="0.01" min="0" required>
                            <select id="creatinine-unit">
                                <option value="mgdl">mg/dL</option>
                                <option value="umoll">μmol/L</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="age">Age (years)</label>
                        <input type="number" id="age" min="18" max="130" required>
                    </div>

                    <div class="form-group">
                        <label>Gender</label>
                        <div class="radio-group">
                            <label class="radio-label">
                                <input type="radio" name="gender" value="male" checked>
                                Male
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="gender" value="female">
                                Female
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit" class="calculate-button">Calculate eGFR</button>
                </form>
                
                <div id="result" class="result-area"></div>
                <div id="error-message" class="error-message" style="color: red; display: none;"></div>
            </div>

            <style>
                .egfr-calculator {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .calculator-form {
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
                .input-group {
                    display: flex;
                    gap: 10px;
                }
                .input-group input {
                    flex: 1;
                }
                .input-group select {
                    width: 100px;
                }
                input[type="number"], select {
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                }
                .radio-group {
                    display: flex;
                    gap: 20px;
                }
                .radio-label {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    cursor: pointer;
                }
                .calculate-button {
                    width: 100%;
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }
                .calculate-button:hover {
                    background-color: #0056b3;
                }
                .result-area {
                    margin-top: 20px;
                    padding: 15px;
                    border-radius: 4px;
                    background-color: #f8f9fa;
                    display: none;
                }
                .error-message {
                    margin-top: 10px;
                    padding: 10px;
                    border-radius: 4px;
                }
                .result-value {
                    font-size: 1.2em;
                    font-weight: bold;
                    margin: 10px 0;
                }
                .result-category {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #ddd;
                }
                .result-ranges ul {
                    list-style-type: none;
                    padding-left: 0;
                }
                .result-ranges li {
                    margin: 5px 0;
                    padding: 5px 0;
                }
            </style>
        `;

        const form = container.querySelector('#egfr-form');
        const resultArea = container.querySelector('#result');
        const errorMessage = container.querySelector('#error-message');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            try {
                const creatinine = parseFloat(form.querySelector('#creatinine').value);
                const creatinineUnit = form.querySelector('#creatinine-unit').value;
                const age = parseInt(form.querySelector('#age').value);
                const isFemale = form.querySelector('input[name="gender"][value="female"]').checked;

                // Validate inputs
                if (!creatinine || creatinine <= 0) {
                    throw new Error('Please enter a valid serum creatinine value');
                }
                if (!age || age < 18 || age > 130) {
                    throw new Error('Please enter a valid age between 18 and 130');
                }

                // Convert creatinine to mg/dL if needed
                let creatinineMgdL = creatinine;
                if (creatinineUnit === 'umoll') {
                    creatinineMgdL = this.convertToMgDL(creatinine);
                }

                // Calculate eGFR
                const egfr = this.calculateEGFR(creatinineMgdL, age, isFemale);
                const category = this.getEGFRCategory(egfr);

                // Display results
                resultArea.style.display = 'block';
                resultArea.innerHTML = `
                    <div class="result-value">
                        eGFR: ${egfr.toFixed(1)} mL/min/1.73m²
                    </div>
                    <div class="result-category">
                        Category: ${category}
                    </div>
                    <div class="result-ranges">
                        <h4>CKD Classification by GFR:</h4>
                        <ul>
                            <li>Stage 1: > 90 mL/min (Normal or high GFR)</li>
                            <li>Stage 2: 60-89 mL/min (Mild CKD)</li>
                            <li>Stage 3A: 45-59 mL/min (Moderate CKD)</li>
                            <li>Stage 3B: 30-44 mL/min (Moderate CKD)</li>
                            <li>Stage 4: 15-29 mL/min (Severe CKD)</li>
                            <li>Stage 5: < 15 mL/min (End Stage CKD)</li>
                        </ul>
                    </div>
                `;
                errorMessage.style.display = 'none';

            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
                resultArea.style.display = 'none';
            }
        });
    }
}

// Export the module
export default EGFRCalculator;
