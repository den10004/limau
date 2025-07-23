import { NextRequest, NextResponse } from "next/server";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email;

  if (!email) {
    return (
      <div className="">
        <div className="">
          <h1 className="">Ошибка отписки</h1>
          <p className="">Не указан email для отписки.</p>
        </div>
      </div>
    );
  }

  try {
    const response = await fetch(
      `${
        process.env.API_URL
      }/api/subscribers/delete-by-email/${encodeURIComponent(email)}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      }
    );

    if (response.ok) {
      return (
        <div className="">
          <div className="">
            <h1 className="">Отписка успешна</h1>
            <p>Вы успешно отписались от рассылки.</p>
            <p className="mt-4">Email: {decodeURIComponent(email)}</p>
          </div>
        </div>
      );
    } else {
      throw new Error("Failed to unsubscribe");
    }
  } catch (error) {
    return (
      <div className="">
        <div className="">
          <h1 className="">Ошибка отписки</h1>
          <p className="">
            Произошла ошибка при попытке отписаться. Пожалуйста, попробуйте
            позже.
          </p>
        </div>
      </div>
    );
  }
}
