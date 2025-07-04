// script.js

window.addEventListener('load', () => {
  let groupedData = {};

  const anoSelect = document.getElementById('anoSelect');
  const mesSelect = document.getElementById('mesSelect');
  const excelDataDiv = document.getElementById('excelData');
  const tituloTabela = document.getElementById('tituloTabela');

  // Funções auxiliares
  function excelDateToJSDate(serial) {
    const utc_days = Math.floor(serial - 25569 + 1);
    const utc_value = utc_days * 86400 * 1000;
    return new Date(utc_value);
  }

  function formatDateBRFromDateObj(dateObj) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function sortDatesBR(a, b) {
    const [dayA, monthA, yearA] = a.split('/');
    const [dayB, monthB, yearB] = b.split('/');
    const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
    return dateA - dateB;
  }

  function preencherAnos() {
    const anos = new Set();
    Object.keys(groupedData).forEach(dataStr => {
      const ano = dataStr.split('/')[2];
      anos.add(ano);
    });
    const anosOrdenados = Array.from(anos).sort();
    anoSelect.innerHTML = '<option value="0">Todos</option>' +
      anosOrdenados.map(a => `<option value="${a}">${a}</option>`).join('');
  }

  function filtrarEDesenharTabela() {
    const anoFiltro = anoSelect.value;
    const mesFiltro = parseInt(mesSelect.value);

    let datasFiltradas = Object.keys(groupedData).filter(dataStr => {
      const [day, month, year] = dataStr.split('/').map(x => parseInt(x));
      if (anoFiltro != 0 && year != parseInt(anoFiltro)) return false;
      if (mesFiltro !== 0 && month !== mesFiltro) return false;
      return true;
    });

    datasFiltradas.sort(sortDatesBR);

    if (datasFiltradas.length === 0) {
      excelDataDiv.innerHTML = '<p>Nenhum dado encontrado para o filtro selecionado.</p>';
      atualizarFechamento(0, 0, 0, 0);
      return;
    }

    const primeiroDia = datasFiltradas[0];
    const ultimoDia = datasFiltradas[datasFiltradas.length - 1];

    let html = `<table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Sujo (KG's)</th>
          <th>Limpo (KG's)</th>
          <th>Pendência c/ 10% (KG's)</th>
        </tr>
      </thead>
      <tbody>`;

    let totalSujo = 0;
    let totalLimpo = 0;
    let pendenciaTotalAcumulada = 0;

    for (let i = 0; i < datasFiltradas.length; i++) {
      const dataAtual = datasFiltradas[i];
      const sujoVal = groupedData[dataAtual]?.sujo || 0;
      const limpoVal = groupedData[dataAtual]?.limpo || 0;

      let sujo = sujoVal > 0 ? sujoVal.toFixed(1).replace('.', ',') : '-';
      let limpo = limpoVal > 0 ? limpoVal.toFixed(1).replace('.', ',') : '-';
      let pendencia = '-';

      if (dataAtual === primeiroDia) {
        limpo = '-';
      } else if (dataAtual === ultimoDia) {
        sujo = '-';
      }

      if (i > 0) {
        const diaAnterior = datasFiltradas[i - 1];
        const sujoAnterior = groupedData[diaAnterior]?.sujo || 0;
        const pendenciaCalc = limpoVal - sujoAnterior * 0.9;
        pendencia = pendenciaCalc.toFixed(1).replace('.', ',');
      }

      html += `<tr>
        <td>${dataAtual}</td>
        <td>${sujo}</td>
        <td>${limpo}</td>
        <td>${pendencia}</td>
      </tr>`;

      if (sujo !== '-') totalSujo += sujoVal;
      if (limpo !== '-') totalLimpo += limpoVal;
      if (pendencia !== '-') pendenciaTotalAcumulada += parseFloat(pendencia.replace(',', '.'));
    }

    let pendenciaTotal = totalSujo - totalLimpo;
    let pendenciaTotalExibida = -pendenciaTotal;
    let pendenciaTotal10 = totalLimpo - totalSujo * 0.9;

    html += '</tbody></table>';
    excelDataDiv.innerHTML = html;

    atualizarFechamento(totalSujo, totalLimpo, pendenciaTotalExibida, pendenciaTotal10);
  }

  function atualizarFechamento(sujo, limpo, pendencia, pendencia10) {
    const formatarSemSinal = num => num.toFixed(1).replace('.', ',');
    const formatarComSinal = num => {
      const sinal = (num > 0) ? '+' : (num < 0) ? '-' : '';
      return `${sinal}${Math.abs(num).toFixed(1).replace('.', ',')}`;
    };

    document.getElementById('totalSujo').innerText = formatarSemSinal(sujo);
    document.getElementById('totalLimpo').innerText = formatarSemSinal(limpo);
    document.getElementById('pendenciaTotal').innerText = formatarComSinal(pendencia);
    document.getElementById('pendenciaTotal10').innerText = formatarComSinal(pendencia10);

    const pendenciaElem = document.getElementById('pendenciaTotal');
    const pendencia10Elem = document.getElementById('pendenciaTotal10');

    pendenciaElem.style.color = pendencia > 0 ? 'green' : (pendencia < 0 ? 'red' : 'inherit');
    pendencia10Elem.style.color = pendencia10 > 0 ? 'green' : (pendencia10 < 0 ? 'red' : 'inherit');
  }

  anoSelect.addEventListener('change', filtrarEDesenharTabela);
  mesSelect.addEventListener('change', filtrarEDesenharTabela);

  // Listener para os radios do container Relatórios
  const radiosRelatorio = document.querySelectorAll('input[name="relatorio"]');
  radiosRelatorio.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        switch (radio.value) {
          case 'lencois':
            tituloTabela.textContent = 'Lençóis - registros';
            break;
          case 'cobertores':
            tituloTabela.textContent = 'Cobertores - registros';
            break;
          case 'enxoval':
            tituloTabela.textContent = 'Enxoval total - registros';
            break;
        }

        // Futuro: aqui pode chamar função para carregar outra base, por exemplo:
        // carregarDadosPorTipo(radio.value);
      }
    });
  });

  fetch(`dados/dados.xlsx?v=${Date.now()}`)
    .then(response => {
      if (!response.ok) throw new Error("Arquivo Excel não encontrado");
      return response.arrayBuffer();
    })
    .then(data => {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      groupedData = {};

      jsonData.forEach(row => {
        let dataRaw = row['DATA'];
        let dataFormatada;

        if (typeof dataRaw === 'number') {
          const dataObj = excelDateToJSDate(dataRaw);
          dataFormatada = formatDateBRFromDateObj(dataObj);
        } else {
          dataFormatada = dataRaw;
        }

        const kg = parseFloat(row['KG TOTAL']) || 0;
        const tipo = row['ENVIO OU RETORNO?'].toLowerCase();

        if (!groupedData[dataFormatada]) {
          groupedData[dataFormatada] = { sujo: 0, limpo: 0 };
        }

        if (tipo.includes('enviado')) {
          groupedData[dataFormatada].sujo += kg;
        } else if (tipo.includes('recebido')) {
          groupedData[dataFormatada].limpo += kg;
        }
      });

      preencherAnos();

      const hoje = new Date();
      const mesAtual = (hoje.getMonth() + 1).toString();
      const anoAtual = hoje.getFullYear().toString();

      mesSelect.value = mesAtual;
      anoSelect.value = anoAtual;

      filtrarEDesenharTabela();
    })
    .catch(error => {
      excelDataDiv.innerText = 'Erro ao carregar a planilha.';
      console.error('Erro ao carregar Excel:', error);
    });

  // Exportar em PDF via window.print()
  document.getElementById("btnExportarPDF").addEventListener("click", () => {
    window.print();
  });
});
