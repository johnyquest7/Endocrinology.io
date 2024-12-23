export default class MetabolicSyndromeCalculator {
    constructor() {
        this.name = 'Metabolic Syndrome Calculator';
        this.description = 'Calculate risk for metabolic syndrome based on ATP-III Criteria';
    }

    checkCriteria(data) {
        let criteria = [];
        let criteriaCount = 0;

        // Check waist circumference based on gender
        const waistThreshold = data.gender === 'male' ? 102 : 88; // cm
        if (data.waistSize >= waistThreshold) {
            criteriaCount++;
            criteria.push('Elevated waist circumference');
        }

        // Check triglycerides
        if (data.triglycerides >= 150) {
            criteriaCount++;
            criteria.push('High triglycerides');
        }

        // Check HDL based on gender
        const hdlThreshold = data.gender === 'male' ? 40 : 50;
        if (data.hdl < hdlThreshold) {
            criteriaCount++;
            criteria.push('Low HDL cholesterol');
        }

        // Check blood pressure
        if (data.systolic >= 130 || data.diastolic >= 85) {
            criteriaCount++;
            criteria.push('Elevated blood pressure');
        }

        // Check fasting glucose
        if (data.fastingGlucose >= 110) {
            criteriaCount++;
            criteria.push('High fasting glucose');
        }

        return {
            hasMetabolicSyndrome: criteriaCount >= 3,
            criteriaCount: criteriaCount,
            metCriteria: criteria
        };
    }

    render(container) {
        container.innerHTML = `
            <div class="calculator metabolic-syndrome-calculator">
                <h2>${this.name}</h2>
                <p>${this.description}</p>
                
                <form id="metabolic-syndrome-form" class="calculator-form">
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
                        <label for="waistSize">Waist Size *</label>
                        <div class="input-with-unit">
                            <input type="number" id="waistSize" required step="0.1" min="0">
                            <select id="waistUnit">
                                <option value="inches">Inches</option>
                                <option value="cm">cm</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="triglycerides">Triglycerides level * (mg/dL)</label>
                        <input type="number" id="triglycerides" required step="1" min="0">
                    </div>

                    <div class="form-group">
                        <label for="hdl">HDL-Cholesterol * (mg/dL)</label>
                        <input type="number" id="hdl" required step="1" min="0">
                    </div>

                    <div class="form-group">
                        <label>Blood pressure Systolic/Diastolic * (mm Hg)</label>
                        <div class="bp-inputs">
                            <input type="number" id="systolic" required step="1" min="0" placeholder="Systolic">
                            <span>/</span>
                            <input type="number" id="diastolic" required step="1" min="0" placeholder="Diastolic">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="fastingGlucose">Fasting Blood Glucose * (mg/dL)</label>
                        <input type="number" id="fastingGlucose" required step="1" min="0">
                    </div>

                    <button type="submit" class="calculate-button">Calculate</button>
                </form>
                
                <div id="metabolic-result" class="result-area"></div>
            </div>
        `;

        // Add event listeners
        const form = container.querySelector('#metabolic-syndrome-form');
        const waistSizeInput = container.querySelector('#waistSize');
        const waistUnitSelect = container.querySelector('#waistUnit');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let waistSize = parseFloat(waistSizeInput.value);
            // Convert inches to cm if needed
            if (waistUnitSelect.value === 'inches') {
                waistSize = waistSize * 2.54;
            }

            const data = {
                gender: form.querySelector('input[name="gender"]:checked').value,
                waistSize: waistSize,
                triglycerides: parseFloat(form.querySelector('#triglycerides').value),
                hdl: parseFloat(form.querySelector('#hdl').value),
                systolic: parseFloat(form.querySelector('#systolic').value),
                diastolic: parseFloat(form.querySelector('#diastolic').value),
                fastingGlucose: parseFloat(form.querySelector('#fastingGlucose').value)
            };

            const result = this.checkCriteria(data);
            
            const resultDiv = container.querySelector('#metabolic-result');
            resultDiv.innerHTML = `
                <h3>Results</h3>
                <p class="result-status ${result.hasMetabolicSyndrome ? 'alert' : 'normal'}">
                    ${result.hasMetabolicSyndrome ? 
                        'Metabolic Syndrome criteria are met' : 
                        'Metabolic Syndrome criteria are not met'}
                </p>
                <p>Number of criteria met: ${result.criteriaCount} (≥3 required for diagnosis)</p>
                ${result.metCriteria.length > 0 ? 
                    `<p>Criteria met:</p>
                    <ul>
                        ${result.metCriteria.map(criterion => `<li>${criterion}</li>`).join('')}
                    </ul>` : 
                    ''}
                <p class="info-note">Note: This calculator uses ATP-III Criteria. Please consult with a healthcare provider for proper diagnosis.</p>
            `;
        });
    }
}
