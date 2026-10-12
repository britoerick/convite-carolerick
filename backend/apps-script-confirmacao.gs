/**
 * Recebe as confirmações do convite, grava numa planilha do Google
 * e avisa por e-mail a cada resposta.
 *
 * Como usar: veja o arquivo como-configurar.md
 */

const NOTIFY_EMAIL = 'carolbritomacedo@gmail.com'; // quem recebe o aviso a cada confirmação
const SHEET_NAME = 'Confirmações';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000); // evita que duas respostas simultâneas se misturem
  try {
    const data = JSON.parse(e.postData.contents);

    const presenca = data.presenca === 'sim' ? 'Vai' : 'Não vai';
    const convidados = (Array.isArray(data.convidados) ? data.convidados : [])
      .slice(0, 10).map(function (n) { return String(n).slice(0, 80); });
    const quantidade = convidados.length;
    const convite = String(data.convite || '').slice(0, 80);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data e hora', 'Presença', 'Qtd. de pessoas', 'Convidados', 'Link do convite']);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }
    sheet.appendRow([new Date(), presenca, quantidade, convidados.join(', '), convite]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: (presenca === 'Vai' ? '✅ Confirmou presença' : '❌ Não poderá ir') + ' · ' + (convidados[0] || 'sem nome'),
      htmlBody:
        '<p><b>' + presenca + '</b> · ' + quantidade + (quantidade === 1 ? ' pessoa' : ' pessoas') + '</p>' +
        '<p><b>Convidados:</b> ' + esc(convidados.join(', ')) + '</p>' +
        (convite ? '<p><b>Link do convite:</b> ' + esc(convite) + '</p>' : '') +
        '<p style="color:#888">Todas as respostas ficam na planilha "' + esc(ss.getName()) + '".</p>'
    });

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Abrir a URL do script no navegador deve mostrar esta mensagem (serve para testar a publicação)
function doGet() {
  return ContentService.createTextOutput('Confirmações ativas.');
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Evita que um nome com "<" ou "&" quebre o e-mail
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
