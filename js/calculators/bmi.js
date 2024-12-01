// BMI Calculator Module
class BMICalculator {
    constructor() {
        this.name = 'BMI Calculator';
        this.description = 'Calculate Body Mass Index (BMI)';
    }

    calculateBMI(weight, height) {
        // Weight in kg, height in meters
        return weight / (height * height);
    }

    getBMICategory(bmi) {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }

    render(container) {
        container.innerHTML = `
            <div class="calculator bmi-calculator">
                <h2>${this.name}</h2>
                <p>${this.description}</p>
                
                <form id="bmi-form" class="calculator-form">
                    <div class="form-group">
                        <label for="weight">Weight (kg)</label>
                        <input type="number" id="weight" required step="0.1" min="0">
                    </div>
                    
                    <div class="form-group">
                        <label for="height">Height (m)</label>
                        <input type="number" id="height" required step="0.01" min="0">
                    </div>
                    
                    <button type="submit" class="calculate-button">Calculate BMI</button>
                </form>
                
                <div id="bmi-result" class="result-area"></div>
            </div>
        `;

        // Add event listener for form submission
        const form = container.querySelector('#bmi-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const weight = parseFloat(form.querySelector('#weight').value);
            const height = parseFloat(form.querySelector('#height').value);
            
            const bmi = this.calculateBMI(weight, height);
            const category = this.getBMICategory(bmi);
            
            const resultDiv = container.querySelector('#bmi-result');
            resultDiv.innerHTML = `
                <h3>Results</h3>
                <p>Your BMI is: ${bmi.toFixed(1)}</p>
                <p>Category: ${category}</p>
            `;
        });
    }
}

// Ensure proper export
export default BMICalculator;