document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.plan-checkbox');
    const selectBtn = document.getElementById('select-plan-btn');

    // Lógica para permitir que apenas um checkbox seja selecionado por vez
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            // Se o checkbox atual foi marcado
            if (event.currentTarget.checked) {
                // Desmarca todos os outros
                checkboxes.forEach(otherCheckbox => {
                    if (otherCheckbox !== event.currentTarget) {
                        otherCheckbox.checked = false;
                    }
                });
            }
        });
    });

    // Lógica para o botão de selecionar plano
    selectBtn.addEventListener('click', () => {
        let selectedPlan = null;
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedPlan = checkbox.getAttribute('data-plan');
            }
        });

        if (selectedPlan) {
            alert(`Você selecionou o plano Olimpiano ${selectedPlan}! Os deuses estão satisfeitos. Prossiga para o login para selar seu destino.`);
            // Redireciona o usuário para a página de login após a seleção
            window.location.href = 'login.html';
        } else {
            alert('Por favor, escolha um dos planos dignos do Olimpo.');
        }
    });
});