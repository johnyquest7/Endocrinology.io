// BMI Calculator Module
class BMICalculator {
    constructor() {
        this.name = 'BMI Calculator';
        this.description = 'Calculate Body Mass Index (BMI)';
    }

    calculateBMI(weight, height, unit) {
        if (unit === 'metric') {
            // Convert cm to meters for calculation
            const heightInMeters = height / 100;
            return weight / (heightInMeters * heightInMeters);
        } else {
            // US System: weight in pounds, height in inches
            // Formula: (weight in pounds × 703) / (height in inches)²
            return (weight * 703) / (height * height);
        }
    }

    convertHeightToInches(feet, inches = 0) {
        return (parseFloat(feet) * 12) + parseFloat(inches || 0);
    }

    getBMICategory(bmi) {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Healthy Weight';
        if (bmi < 30) return 'Overweight';
        if (bmi < 35) return 'Class 1 Obesity';
        if (bmi < 40) return 'Class 2 Obesity';
        return 'Class 3 Obesity (Severe)';
    }

    validateInputs(weight, height, unit) {
        return weight > 0 && height > 0;
    }

    render(container) {
        container.innerHTML = `
            <div class="calculator bmi-calculator">
                <h2>${this.name}</h2>
                <p>${this.description}</p>
                
                <form id="bmi-form" class="calculator-form">
                    <div class="unit-select">
                        <label>Select Unit System:</label>
                        <select id="unit-system" class="unit-selector">
                            <option value="us">US (lb/ft-in)</option>
                            <option value="metric">Metric (kg/cm)</option>
                        </select>
                    </div>

                    <div id="metric-inputs" style="display: none;">
                        <div class="form-group">
                            <label for="weight-kg">Weight (kg)</label>
                            <input type="number" id="weight-kg" step="0.1" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label for="height-cm">Height (cm)</label>
                            <input type="number" id="height-cm" step="0.1" min="0">
                        </div>
                    </div>

                    <div id="us-inputs">
                        <div class="form-group">
                            <label for="weight-lb">Weight (pounds)</label>
                            <input type="number" id="weight-lb" step="0.1" min="0">
                        </div>
                        
                        <div class="form-group height-us">
                            <label>Height:</label>
                            <div class="height-inputs">
                                <div>
                                    <input type="number" id="height-ft" min="0" placeholder="feet">
                                    <label for="height-ft">ft</label>
                                </div>
                                <div>
                                    <input type="number" id="height-in" min="0" max="11" placeholder="inches">
                                    <label for="height-in">in</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" class="calculate-button">Calculate BMI</button>
                </form>
                
                <div id="bmi-result" class="result-area"></div>
                <div id="error-message" class="error-message" style="color: red; display: none;"></div>
            </div>

            <style>
                .unit-select {
                    margin-bottom: 20px;
                }
                .unit-selector {
                    padding: 5px;
                    width: 200px;
                }
                .height-inputs {
                    display: flex;
                    gap: 15px;
                }
                .height-inputs div {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .height-inputs input {
                    width: 80px;
                }
                .error-message {
                    margin-top: 10px;
                    padding: 10px;
                }
                .result-area {
                    margin-top: 20px;
                }
                .result-area ul {
                    list-style-type: none;
                    padding-left: 0;
                }
                .result-area ul li {
                    margin: 5px 0;
                }
                .calculate-button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .calculate-button:hover {
                    background-color: #0056b3;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                input[type="number"] {
                    padding: 5px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
            </style>
        `;

        // Add event listeners
        const form = container.querySelector('#bmi-form');
        const unitSelector = container.querySelector('#unit-system');
        const metricInputs = container.querySelector('#metric-inputs');
        const usInputs = container.querySelector('#us-inputs');
        const errorMessage = container.querySelector('#error-message');

        // Unit system toggle
        unitSelector.addEventListener('change', function() {
            if (this.value === 'metric') {
                metricInputs.style.display = 'block';
                usInputs.style.display = 'none';
                // Clear US inputs
                form.querySelector('#weight-lb').value = '';
                form.querySelector('#height-ft').value = '';
                form.querySelector('#height-in').value = '';
            } else {
                metricInputs.style.display = 'none';
                usInputs.style.display = 'block';
                // Clear metric inputs
                form.querySelector('#weight-kg').value = '';
                form.querySelector('#height-cm').value = '';
            }
            // Clear previous results and errors
            container.querySelector('#bmi-result').innerHTML = '';
            errorMessage.style.display = 'none';
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const unitSystem = unitSelector.value;
            let weight, height;

            try {
                if (unitSystem === 'metric') {
                    weight = parseFloat(form.querySelector('#weight-kg').value);
                    height = parseFloat(form.querySelector('#height-cm').value);

                    if (!weight || !height) {
                        throw new Error('Please enter both weight and height.');
                    }
                } else {
                    weight = parseFloat(form.querySelector('#weight-lb').value);
                    const feet = form.querySelector('#height-ft').value;
                    const inches = form.querySelector('#height-in').value;
                    
                    if (!weight || !feet) {
                        throw new Error('Please enter weight and height in feet.');
                    }
                    
                    height = this.convertHeightToInches(feet, inches);
                }

                // Validate inputs
                if (!this.validateInputs(weight, height, unitSystem)) {
                    throw new Error('Please enter valid measurements. All values must be greater than 0.');
                }

                const bmi = this.calculateBMI(weight, height, unitSystem);
                
                // Validate BMI result
                if (isNaN(bmi) || !isFinite(bmi)) {
                    throw new Error('Unable to calculate BMI. Please check your measurements.');
                }

                const category = this.getBMICategory(bmi);
                
                errorMessage.style.display = 'none';
                const resultDiv = container.querySelector('#bmi-result');
                resultDiv.innerHTML = `
                    <h3>Results</h3>
                    <p>Your BMI is: ${bmi.toFixed(1)}</p>
                    <p>Category: ${category}</p>
                    <p class="bmi-info">BMI Categories:</p>
                    <ul>
                        <li>Underweight: Less than 18.5</li>
                        <li>Healthy Weight: 18.5 to 24.9</li>
                        <li>Overweight: 25 to 29.9</li>
                        <li>Class 1 Obesity: 30 to 34.9</li>
                        <li>Class 2 Obesity: 35 to 39.9</li>
                        <li>Class 3 Obesity (Severe): 40 or greater</li>
                    </ul>
                `;
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
                container.querySelector('#bmi-result').innerHTML = '';
            }
        });
    }
}

// Ensure proper export
export default BMICalculator;
