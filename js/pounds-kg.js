// Weight Converter Module
class WeightConverter {
    constructor() {
        this.name = 'Weight Converter';
        this.description = 'Convert between Pounds and Kilograms';
    }

    // Conversion functions
    poundsToKg(pounds) {
        return pounds * 0.453592;
    }

    kgToPounds(kg) {
        return kg * 2.20462;
    }

    render(container) {
        container.innerHTML = `
            <div class="converter weight-converter">
                <h2>${this.name}</h2>
                <p>${this.description}</p>
                
                <form id="converter-form" class="converter-form">
                    <div class="form-group">
                        <label for="pounds">Weight in Pounds (lb)</label>
                        <input type="number" id="pounds" step="0.01" min="0" placeholder="Enter pounds">
                    </div>
                    
                    <div class="form-group">
                        <label for="kilograms">Weight in Kilograms (kg)</label>
                        <input type="number" id="kilograms" step="0.01" min="0" placeholder="Enter kilograms">
                    </div>
                    
                    <button type="submit" class="convert-button">Convert Units</button>
                </form>
                
                <div id="error-message" class="error-message" style="color: red; display: none;"></div>
            </div>

            <style>
                .weight-converter {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .converter-form {
                    margin-top: 20px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                .form-group input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                }
                .convert-button {
                    width: 100%;
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 10px;
                }
                .convert-button:hover {
                    background-color: #0056b3;
                }
                .error-message {
                    margin-top: 10px;
                    padding: 10px;
                    border-radius: 4px;
                }
            </style>
        `;

        // Get form elements
        const form = container.querySelector('#converter-form');
        const poundsInput = form.querySelector('#pounds');
        const kgInput = form.querySelector('#kilograms');
        const errorMessage = container.querySelector('#error-message');

        // Clear other field when user types
        poundsInput.addEventListener('input', () => {
            kgInput.value = '';
            errorMessage.style.display = 'none';
        });

        kgInput.addEventListener('input', () => {
            poundsInput.value = '';
            errorMessage.style.display = 'none';
        });

        // Form submission handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            try {
                const poundsValue = parseFloat(poundsInput.value);
                const kgValue = parseFloat(kgInput.value);

                // Check which field has a value and perform conversion
                if (poundsValue && !kgValue) {
                    // Convert pounds to kg
                    if (poundsValue < 0) {
                        throw new Error('Please enter a positive value');
                    }
                    kgInput.value = this.poundsToKg(poundsValue).toFixed(2);
                } else if (kgValue && !poundsValue) {
                    // Convert kg to pounds
                    if (kgValue < 0) {
                        throw new Error('Please enter a positive value');
                    }
                    poundsInput.value = this.kgToPounds(kgValue).toFixed(2);
                } else {
                    throw new Error('Please enter a value in one of the fields');
                }

                errorMessage.style.display = 'none';
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            }
        });
    }
}

// Export the module
export default WeightConverter;
