import Swal from "sweetalert2";

const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith(".h5")) {
        Swal.fire({
          title: "Invalid file!!",
          text: "Please select files with .h5 extension only.",
          icon: "error",
          confirmButtonText: "OK",
        });
        e.target.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        Swal.fire({
          title: result.success ? "success!" : "error!",
          text: result.message,
          icon: result.success ? "success" : "error",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Upload Success", error);
        Swal.fire({
          title: "success!",
          text: "file upload successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    }
  };
export default handleFileUpload;