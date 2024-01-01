exports.adminMailBody = (params) => {
return `
以下内容で会員の申し込みを受けつけました。

お名前:
${params.name}

メールアドレス:
${params.email}

種別:
${params.content}
`;
};

exports.thanksMailBody = (params) => {
  return `
${params.name} 様

お申し込みありがとうございます。
以下内容で受け付けました。

お名前:
${params.name}

メールアドレス:
${params.email}

種別:
${params.content}

後ほど担当者よりご連絡を差し上げます。
よろしくお願いいたします。
`;
};
