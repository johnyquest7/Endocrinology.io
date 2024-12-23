export default class SteroidConverter {
    constructor() {
        this.name = 'Steroid Converter';
        this.description = 'Convert between equivalent doses of different steroids';
        
        // Define steroid list and their potencies
        this.steroids = [
            { name: 'hydrocortisone', potency: 1 },
            { name: 'cortisone', potency: 0.8 },
            { name: 'prednisone', potency: 4 },
            { name: 'prednisolone', potency: 4 },
            { name: 'triamcinolone', potency: 5 },
            { name: 'methylprednisolone', potency: 5 },
            { name: 'dexamethasone', potency: 25 },
            { name: 'betamethasone', potency: 30 }
        ];
    }

    calculateEquivalentDose(dose, fromSteroid, toSteroid) {
        const potency1 = fromSteroid.potency;
        const potency2 = toSteroid.potency;
        return dose * (potency1 / potency2);
    }

    render(container) {
        container.innerHTML = `
            <div class="calculator steroid-converter">
                <h2>${this.name}</h2>
                <p>${this.description}</p>
                
                <form id="steroid-form" class="calculator-form">
                    <div class="steroid-selectors">
                        <div class="form-group">
                            <label for="fromSteroid">Convert from:</label>
                            <select id="fromSteroid" required>
                                ${this.steroids.map((steroid, index) => `
                                    <option value="${index}" ${index === 2 ? 'selected' : ''}>
                                        ${steroid.name.charAt(0).toUpperCase() + steroid.name.slice(1)}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="dose-input form-group">
                            <label for="dose">Dose (mg)</label>
                            <input type="number" id="dose" required min="0" step="0.1">
                        </div>

                        <div class="form-group">
                            <label for="toSteroid">Convert to:</label>
                            <select id="toSteroid" required>
                                ${this.steroids.map((steroid, index) => `
                                    <option value="${index}" ${index === 2 ? 'selected' : ''}>
                                        ${steroid.name.charAt(0).toUpperCase() + steroid.name.slice(1)}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>

                    <div id="steroid-result" class="result-area">
                        <div class="equivalent-dose">
                            <span id="result-value">0.00</span> mg
                        </div>
                    </div>
                </form>

                <div class="info-box">
                    <h3>Relative Potencies</h3>
                    <div class="potency-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Steroid</th>
                                    <th>Relative Potency</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.steroids.map(steroid => `
                                    <tr>
                                        <td>${steroid.name.charAt(0).toUpperCase() + steroid.name.slice(1)}</td>
                                        <td>${steroid.potency}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        const form = container.querySelector('#steroid-form');
        const doseInput = form.querySelector('#dose');
        const fromSelect = form.querySelector('#fromSteroid');
        const toSelect = form.querySelector('#toSteroid');
        const resultValue = form.querySelector('#result-value');

        const updateResult = () => {
            const dose = parseFloat(doseInput.value) || 0;
            const fromSteroid = this.steroids[parseInt(fromSelect.value)];
            const toSteroid = this.steroids[parseInt(toSelect.value)];
            
            const equivalentDose = this.calculateEquivalentDose(dose, fromSteroid, toSteroid);
            resultValue.textContent = equivalentDose.toFixed(2);
        };

        // Add input event listeners
        doseInput.addEventListener('input', updateResult);
        fromSelect.addEventListener('change', updateResult);
        toSelect.addEventListener('change', updateResult);
    }
}
