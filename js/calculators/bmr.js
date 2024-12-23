export default class BMRCalculator {
    constructor() {
        this.name = 'Basal Metabolic Rate Calculator';
        this.description = 'Calculate your Basal Metabolic Rate using multiple formulas';
    }

    calculateHarrisBenedict(weight, height, age, gender) {
        // Weight in kg, height in cm, age in years
        if (gender === 'male') {
            return 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
        } else {
            return 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
        }
    }

    calculateMifflinStJeor(weight, height, age, gender) {
        // Weight in kg, height in cm, age in years
        if (gender === 'male') {
            return (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            return (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
    }

    calculateKatchMcArdle(weight, bodyFat) {
        // Weight in kg, body fat in percentage
        const leanMass = weight * (1 - (bodyFat / 100));
        return 370 + (21.6 * leanMass);
    }

    calculateTDEE(bmr, activityLevel) {
        const activityMultipliers = {
            'sedentary': 1.2,      // Little or no exercise
            'light': 1.375,        // Light exercise/sports 1-3 days/week
            'moderate': 1.55,      // Moderate exercise/sports 3-5 days/week
            'active': 1.725,       // Hard exercise/sports 6-7 days/week
            'veryActive': 1.9      // Very hard exercise/sports & physical job or training twice per day
        };
        return bmr * activityMultipliers[activityLevel];
    }

    render(container) {
        container.innerHTML = `
            <div class="calculator bmr-calculator">
                <h2>${this.name}</h2>
                <p>${this.description}</p>
                
                <form id="bmr-form" class="calculator-form">
                    <div class="form-group">
                        <label>Gender *</label>
                        <div class="radio-group">
                            <input type="radio" id="male" name="gender" value="male" checked>
                            <label for="male">Male</label>
                            <input type="radio" id="female" name="gender" value="female">
                            <label for="female">Female</label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="age">Age * (years)</label>
                        <input type="number" id="age" required min="15" max="120">
                    </div>

                    <div class="form-group">
                        <label for="weight">Weight *</label>
                        <div class="input-with-unit">
                            <input type="number" id="weight" required step="0.1" min="20" max="300">
                            <select id="weightUnit">
                                <option value="kg">kg</option>
                                <option value="lbs">lbs</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="height">Height *</label>
                        <div class="input-with-unit">
                            <input type="number" id="height" required step="0.1" min="50" max="300">
                            <select id="heightUnit">
                                <option value="cm">cm</option>
                                <option value="inches">inches</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="bodyFat">Body Fat % (optional, for Katch-McArdle formula)</label>
                        <input type="number" id="bodyFat" min="1" max="70" step="0.1">
                    </div>

                    <div class="form-group">
                        <label for="activityLevel">Activity Level *</label>
                        <select id="activityLevel" required>
                            <option value="sedentary">Sedentary (little or no exercise)</option>
                            <option value="light">Light (exercise 1-3 days/week)</option>
                            <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                            <option value="active">Active (exercise 6-7 days/week)</option>
                            <option value="veryActive">Very Active (hard exercise & physical job)</option>
                        </select>
                    </div>

                    <button type="submit" class="calculate-button">Calculate BMR</button>
                </form>
                
                <div id="bmr-result" class="result-area"></div>
            </div>
        `;

        const form = container.querySelector('#bmr-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const gender = form.querySelector('input[name="gender"]:checked').value;
            const age = parseInt(form.querySelector('#age').value);
            let weight = parseFloat(form.querySelector('#weight').value);
            let height = parseFloat(form.querySelector('#height').value);
            const bodyFat = parseFloat(form.querySelector('#bodyFat').value) || null;
            const activityLevel = form.querySelector('#activityLevel').value;
            
            // Convert units if necessary
            if (form.querySelector('#weightUnit').value === 'lbs') {
                weight = weight * 0.453592; // Convert lbs to kg
            }
            if (form.querySelector('#heightUnit').value === 'inches') {
                height = height * 2.54; // Convert inches to cm
            }

            // Calculate BMR using different formulas
            const harrisBenedictBMR = this.calculateHarrisBenedict(weight, height, age, gender);
            const mifflinStJeorBMR = this.calculateMifflinStJeor(weight, height, age, gender);
            let katchMcArdleBMR = null;
            if (bodyFat !== null) {
                katchMcArdleBMR = this.calculateKatchMcArdle(weight, bodyFat);
            }

            // Calculate average BMR (excluding null values)
            let bmrValues = [harrisBenedictBMR, mifflinStJeorBMR];
            if (katchMcArdleBMR !== null) {
                bmrValues.push(katchMcArdleBMR);
            }
            const averageBMR = bmrValues.reduce((a, b) => a + b) / bmrValues.length;

            // Calculate TDEE
            const tdee = this.calculateTDEE(averageBMR, activityLevel);

            // Display results
            const resultDiv = container.querySelector('#bmr-result');
            resultDiv.innerHTML = `
                <h3>Results</h3>
                <div class="bmr-results">
                    <div class="result-item">
                        <h4>Harris-Benedict Formula</h4>
                        <p>BMR: ${Math.round(harrisBenedictBMR)} calories/day</p>
                    </div>
                    
                    <div class="result-item">
                        <h4>Mifflin-St Jeor Formula</h4>
                        <p>BMR: ${Math.round(mifflinStJeorBMR)} calories/day</p>
                    </div>
                    
                    ${katchMcArdleBMR !== null ? `
                    <div class="result-item">
                        <h4>Katch-McArdle Formula</h4>
                        <p>BMR: ${Math.round(katchMcArdleBMR)} calories/day</p>
                    </div>
                    ` : ''}

                    <div class="result-item average">
                        <h4>Average BMR</h4>
                        <p>${Math.round(averageBMR)} calories/day</p>
                    </div>

                    <div class="result-item tdee">
                        <h4>Total Daily Energy Expenditure (TDEE)</h4>
                        <p>${Math.round(tdee)} calories/day</p>
                    </div>
                </div>
                
                <div class="info-note">
                    <p>Note: These calculations are estimates. Your actual BMR may vary based on factors such as body composition, genetics, and medical conditions.</p>
                </div>
            `;
        });
    }
}
