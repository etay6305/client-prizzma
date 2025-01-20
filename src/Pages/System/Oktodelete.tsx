import React, { useState } from "react";
import Swal from "sweetalert2";

interface OktodeleteProps {
  name: string; // שם הישות למחיקה
  onDelete: (name: string) => void; // פונקציה שמקבלת את השם למחיקה
}

const OkToDelete: React.FC<OktodeleteProps> = ({ name, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    // הצגת הודעה עם אישור מחיקה
    Swal.fire({
      title: "האם אתה בטוח?",
      text: `האם ברצונך למחוק את ${name}? לא תוכל לשחזר את הפעולה הזו!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "כן, מחק!",
      cancelButtonText: "בטל",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDeleting(true); // מציין שהמחיקה מתבצעת
        onDelete(name); // קריאה לפונקציית המחיקה
        setIsDeleting(false); // מחזיר את מצב הכפתור
      }
    });
  };

  return (
    <button onClick={handleDelete} disabled={isDeleting} className="delete-button">
      {isDeleting ? "מוחק..." : "מחק"}
    </button>
  );
};

export default OkToDelete;
