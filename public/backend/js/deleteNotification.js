import Swal from 'sweetalert2';

//Delete Notification handle [for Admin]
export const deleteNotificatio = (deleteBtns, fn) => {
  if (deleteBtns) {
    for (const button of deleteBtns) {
      button.addEventListener('click', () => {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete!',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'No, keep it',
          confirmButtonText: 'Yes, delete it!'
        }).then(result => {
          if (result.value) {
            fn(button.value);
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
          }
        });
      });
    }
  }
};
