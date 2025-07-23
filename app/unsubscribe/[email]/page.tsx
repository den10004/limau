import { type NextPage } from "next";

type UnsubscribePageProps = {
  params: Promise<{ email: string }>;
};

const UnsubscribePage: NextPage<UnsubscribePageProps> = async ({ params }) => {
  const { email } = await params;

  if (!email) {
    console.error("UnsubscribePage - No email provided");
    return (
      <div
        className="container text-h3-bold"
        style={{
          width: "100%",
          flex: 1,
          fontFamily: "Roboto",
          marginTop: "20px",
        }}
      >
        <div>Ошибка отписки</div>
        <p style={{ marginTop: "20px" }}>Не указан email для отписки.</p>
      </div>
    );
  }

  try {
    if (!process.env.API_URL || !process.env.TOKEN) {
      console.error("UnsubscribePage - Missing environment variables:", {
        apiUrl: process.env.API_URL,
        token: process.env.TOKEN ? "Present" : "Missing",
      });
      throw new Error("Server configuration error: Missing API_URL or TOKEN");
    }

    const apiUrl = `${process.env.API_URL}/subscribers/delete-by-email/${email}`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });

    if (response.ok) {
      return (
        <div
          className="container"
          style={{
            width: "100%",
            flex: 1,
            fontFamily: "Roboto",
            marginTop: "20px",
          }}
        >
          <div className="text-h3-bold">Отписка успешна</div>
          <p style={{ marginTop: "20px" }}>
            Вы успешно отписались от рассылки.
          </p>
          <p className="">Email: {decodeURIComponent(email)}</p>
        </div>
      );
    } else {
      const errorText = await response.text();
      console.error("UnsubscribePage - Fetch Error:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
        apiUrl,
      });
      throw new Error(
        `Failed to unsubscribe: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
  } catch (error) {
    return (
      <div
        className="container text-h3-bold"
        style={{
          width: "100%",
          flex: 1,
          fontFamily: "Roboto",
          marginTop: "20px",
        }}
      >
        <div className="">Ошибка отписки</div>
        <p style={{ marginTop: "20px" }}>
          Произошла ошибка при попытке отписаться
        </p>
      </div>
    );
  }
};

export default UnsubscribePage;
