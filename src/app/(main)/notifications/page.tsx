import NotificationForm from "./components/notification-form";

export default function NotificationsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-gray-600 mt-2">Send push notifications to users</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <NotificationForm />
      </div>
    </div>
  );
}
