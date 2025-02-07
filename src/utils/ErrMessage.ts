export default function errMessage(message: string | number, region: number, language: 'chinese' | 'english' | 'japanese',) {
  if (typeof message === "number") {
    let messageHTML = message.toString();
    switch (message) {
      case -10001:
        messageHTML = language === 'chinese'
          ? "缺少 302 API 密钥"
          : language === 'japanese'
            ? "302 APIキーがありません"
            : "Missing 302 Apikey";
        break;
      case -10002:
        messageHTML = language === 'chinese'
          ? `该工具已禁用/删除，更多请访问 <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
          } target='_blank'>302.AI</a>`
          : language === 'japanese'
            ? `このツールは無効化/削除されています。詳細は <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a>  をご覧ください。`
            : `This tool has been disabled/deleted, for details please view <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a>`;
        break;
      case -10003:
        messageHTML = language === 'chinese'
          ? "网络错误，请稍后重试"
          : language === 'japanese'
            ? "ネットワークエラー、後でもう一度お試しください。"
            : "Network error, please try again later";
        break;
      case -10004:
        messageHTML = language === 'chinese'
          ? `账户余额不足，创建属于自己的工具，更多请访问 <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
          } target='_blank'>302.AI</a>`
          : language === 'japanese'
            ? `アカウント残高が不足しています。独自のツールを作成するには、 <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a> をご覧ください。 `
            : `Insufficient account balance. Create your own tool, for details please view <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a> to create your own tools.`;
        break;
      case -10005:
        messageHTML = language === 'chinese'
          ? "账户凭证过期，请 <a style='text-decoration: underline; color: #0070f0' href='/auth'>重新登录</a>"
          : language === 'japanese'
            ? "アカウントの資格情報が期限切れです。<a style='text-decoration: underline; color: #0070f0' href='/auth'>再度ログイン</a> してください"
            : "Account credential expired, please <a style='text-decoration: underline; color: #0070f0' href='/auth'>log in again</a>";
        break;
      case -10006:
        messageHTML = language === 'chinese'
          ? `账户总额度已达上限，更多请访问 <a style='color:#0070f0;text-decoration:underline' href=${region ? "https://302.ai/" : "https://302ai.cn/"
          } target='_blank'>302.AI</a>`
          : language === 'japanese'
            ? `アカウントの総限度額に達しました。詳細は <a style='color:#0070f0;text-decoration:underline' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a> をご覧ください。`
            : `Total Quota reached maximum limit, for details please view <a style='color:#0070f0;text-decoration:underline' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a>`;
        break;
      case -10007:
        messageHTML = language === 'chinese'
          ? `账户日额度已达上限，更多请访问 <a style='color:#0070f0;text-decoration:underline' href=${region ? "https://302.ai/" : "https://302ai.cn/"
          } target='_blank'>302.AI</a>`
          : language === 'japanese'
            ? `アカウントの日次限度額に達しました。詳細は <a style='color:#0070f0;text-decoration:underline' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a> をご覧ください。`
            : `Daily Quota reached maximum limit, for details please view <a style='color:#0070f0;text-decoration:underline' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>`;
        break;
      case -10008:
        messageHTML = language === 'chinese'
          ? `当前无可用通道，更多请访问 <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
          } target='_blank'>302.AI</a>`
          : language === 'japanese'
            ? `現在利用可能なチャネルはありません。詳細は <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a> をご覧ください。`
            : `No available channels currently, for details please view <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a>`;
        break;
      case -10009:
        messageHTML = language === 'chinese'
          ? `不支持当前API功能，更多请访问 <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
          } target='_blank'>302.AI</a>`
          : language === 'japanese'
            ? `現在のAPI機能はサポートされていません。詳細は <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a> をご覧ください。`
            : `Current API function not supported, for details please view <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a>`;
        break;
      case -10010:
        messageHTML = language === 'chinese'
          ? `未能找到资源，更多请访问 <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
          } target='_blank'>302.AI</a>`
          : language === 'japanese'
            ? `リソースが見つかりませんでした。詳細は <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a> をご覧ください。`
            : `Resource not found, for details please view <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a>`;
        break;
      case -10011:
        messageHTML = language === 'chinese'
          ? `无效的请求`
          : language === 'japanese'
            ? `無効なリクエスト`
            : `Invalid request`;
        break;
      case -10012:
        messageHTML = language === 'chinese'
          ? `该免费工具在本小时的额度已达上限，请访问 <a style='color:#0070f0;text-decoration:underline' href=${region ? "https://302.ai/" : "https://302ai.cn/"
          } target='_blank'>302.AI</a> 生成属于自己的工具`
          : language === 'japanese'
            ? `この無料ツールは今時間の上限に達しました。 <a style='color:#0070f0;text-decoration:underline' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a> を訪問して自分のツールを作成してください`
            : `This free tool's hour quota reached maximum limit. Please view <a style='color:#0070f0;text-decoration:underline' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a> to create your own tool`;
        break;
      case -10018:
        messageHTML = language === 'chinese'
          ? `账户月额度已达上限，更多请访问 <a style='color:#0070f0;text-decoration:underline' href=${region ? "https://302.ai/" : "https://302ai.cn/"}> 302.AI</a>`
          : language === 'japanese'
            ? `アカウントの月次限度額に達しました。詳細は <a style='color:#0070f0;text-decoration:underline' href=${region ? "https://302.ai/" : "https://302ai.cn/"} target='_blank'>302.AI</a> をご覧ください`
            : `Monthly Quota reached maximum limit, for details please visit <a style='color:#0070f0;text-decoration:underline' href=${region ? "https://302.ai/" : "https://302ai.cn/"}> 302.AI</a>`;
        break;
      case -1024:
        messageHTML = language === 'chinese'
          ? `AI接口连接超时，更多请访问 <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"} target='_blank'>302.AI</a>`
          : language === 'japanese'
            ? `AIインターフェース接続がタイムアウトしました。しばらくしてから再試行するか、 <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a> をご覧ください。`
            : `AI interface connection timeout, please try again later or contact <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a>`;
        break;
      default:
        messageHTML = language === 'chinese'
          ? `未知错误，更多请访问 <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
          } target='_blank'>302.AI</a>`
          : language === 'japanese'
            ? `不明なエラー、詳細は <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a> をご覧ください。`
            : `Unknown error, for details please view <a style='text-decoration: underline; color: #0070f0' href=${region ? "https://302.ai/" : "https://302ai.cn/"
            } target='_blank'>302.AI</a>`;
    }
    return messageHTML;
  } else {
    console.log(222, message);
    return message;
  }
}