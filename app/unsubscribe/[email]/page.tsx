import { type NextPage } from "next";

type UnsubscribePageProps = {
  params: Promise<{ email: string }>;
};

const UnsubscribePage: NextPage<UnsubscribePageProps> = async ({ params }) => {
  const { email } = await params;

  console.log("UnsubscribePage - Email:", email);
  console.log("UnsubscribePage - Encoded Email:", encodeURIComponent(email));
  console.log("UnsubscribePage - API URL:", process.env.API_URL);
  console.log(
    "UnsubscribePage - Token:",
    process.env.TOKEN ? "Present" : "Missing"
  );
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Ошибка отписки</h1>
          <p className="text-red-600">Не указан email для отписки.</p>
        </div>
      </div>
    );
  }

  try {
    if (!process.env.API_URL || !process.env.TOKEN) {
      console.error("UnsubscribePage - Missing environment variables:", {
        apiUrl: process.env.API_URL,
        token: process.env.TOKEN ? "Present" : "Missing",
      });
      throw new Error("Server configuration error");
    }

    const response = await fetch(
      `${process.env.API_URL}/subscribers/delete-by-email/${encodeURIComponent(
        email
      )}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      }
    );
    console.log("UnsubscribePage - Response Status:", response.status);
    console.log(
      "UnsubscribePage - Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Отписка успешна</h1>
            <p>Вы успешно отписались от рассылки.</p>
            <p className="mt-4">Email: {decodeURIComponent(email)}</p>
          </div>
        </div>
      );
    } else {
      const errorText = await response.text();
      console.error("UnsubscribePage - Fetch Error:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(
        `Failed to unsubscribe: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Ошибка отписки</h1>
          <p className="text-red-600">
            Произошла ошибка при попытке отписаться: {String(error)}.
            Пожалуйста, попробуйте позже.
          </p>
        </div>
      </div>
    );
  }
};

export default UnsubscribePage;
