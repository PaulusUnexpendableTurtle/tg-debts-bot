"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const money = '₽';
exports.default = {
    start: {
        text() {
            return ''
                + `Привет! 👋\n`
                + `Я — записная книжка долгов.\n\n`
                + `💰 Чтобы попросить в долг, напиши сумму.\n\n`
                + `🗄 Чтобы посмотреть свои долги, напиши /stats.\n\n`
                + `👋 Если хочешь поздороваться ещё раз, напиши /start.\n\n`
                + `❓ Чтобы получить более подробное руководство, напиши /help.`;
        }
    },
    help: {
        text(name) {
            return ''
                + `Команды ([текст] — по вкусу):\n\n`
                + ` N [текст] — ты получил N 💰.\n`
                + `-N [текст] — ты отдал N 💰.\n`
                + `/stats — посмотреть свои долги.\n`
                + `/share — поделиться этим ботом.\n`
                + `/start — краткая справка.\n`
                + `/help — это сообщение.\n\n`
                + `Инлайн (@${name} + команда):\n\n`
                + `пусто — поделиться этим ботом.\n`
                + ` N [текст] — ты получил 💰.\n`
                + `-N [текст] — ты отдал 💰.`;
        }
    },
    share: {
        text(name) {
            return ''
                + `Привет! 👋\n`
                + `Я — Долгер (@${name}), записная книжка долгов.\n`
                + `Ещё увидимся?`;
        },
        keyboard() {
            return {
                reply_markup: {
                    inline_keyboard: [[{
                                text: '🤖 Поделиться ботом',
                                switch_inline_query: ''
                            }]]
                }
            };
        },
        article: {
            title() {
                return 'Поделиться 🤖';
            }
        }
    },
    stats: {
        text(table) {
            if (!table.length) {
                return '👏 Поздравляем, долгов нет!';
            }
            let debts = table
                .filter(debt => debt.amount > 0)
                .map(line => `@${line.to}: ${line.amount}`);
            let debts_string = debts
                .reduce((res, line) => `${res}\n${line}`, 'Вы должны:\n');
            let owes = table
                .filter(debt => debt.amount < 0)
                .map(line => `@${line.to}: ${-line.amount}`);
            let owes_string = owes
                .reduce((res, line) => `${res}\n${line}`, 'Вам должны:\n');
            switch (table.length) {
                case owes.length:
                    return owes_string;
                case debts.length:
                    return debts_string;
                default:
                    return `${debts_string}\n\n${owes_string}`;
            }
        },
        callback_answer_text() {
            return '🔄 Обновлено';
        },
        keyboard() {
            return {
                reply_markup: {
                    inline_keyboard: [[{
                                text: '🔄 Обновить',
                                callback_data: 'update'
                            }]]
                }
            };
        }
    },
    debt: {
        text(text, amount) {
            if (text && (text.length > 1)) {
                return ''
                    + `*${debt_info(amount)}*`
                    + `\n`
                    + text.substr(1);
            }
            else {
                return debt_info(amount) + '.';
            }
        },
        keyboard(text, amount) {
            return {
                reply_markup: {
                    inline_keyboard: [[{
                                text: debt_info(amount, true),
                                switch_inline_query: `${amount}${text || ''}`
                            }]]
                }
            };
        },
        amount_overflow_text() {
            return error_text('Долг слишком большой.');
        },
        article: {
            title(amount) {
                return `${amount > 0 ? 'Взять в долг' : 'Отдать'} ${Math.abs(amount)} ${money}`;
            },
            keyboard() {
                return {
                    inline_keyboard: [[
                            { text: '🌝 Ок', callback_data: '1' },
                            { text: '🌚 Не', callback_data: '0' }
                        ]]
                };
            }
        }
    },
    deal: {
        text(from, amount, to, accept) {
            let person = amount > 0 ? from : to;
            let neg = accept ? '' : 'не ';
            return `${sign(accept)} @${person} ${neg}получил ${Math.abs(amount)} ${money}.`;
        },
        self_accept_text() {
            return error_text('Нельзя должать себе');
        },
        cancel_text() {
            return error_text('Запрос отменен.');
        },
        expire_text() {
            return error_text('Время запроса истекло.');
        }
    }
};
function debt_info(amount, hide) {
    let action = amount > 0 ? 'взял в долг' : 'отдал';
    let object = hide ? '💰' : (`${Math.abs(amount)} ${money}`);
    return `Я ${action} ${object}`;
}
function error_text(text) {
    return '❌ ' + text;
}
function sign(ok) {
    return ok ? '✅' : '❌';
}
