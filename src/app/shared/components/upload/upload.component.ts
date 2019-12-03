import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
// import { CommonService } from '../../services/common.service';
// import { of } from 'rxjs';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html'
})
export class UploadComponent implements OnInit {

    fileToUpload: FileList;
    deletedDocs: number[] = [];
    //uploadedDocs: RfqDocument[];
    id: number;


    @Output('onFileUpdate') onFileUpdate = new EventEmitter<FileList>();

    @Input('parentId') parentId;

    constructor() { }

    ngOnInit(): void {
        this.id = Math.round(Math.random() * 10);
    }

    /**
   * This function is used to add document to a particular RFQ Item
   * @param files Document to be upload
   */
    uploadFiles(files: FileList) {
        let newFiles = new DataTransfer();
        Object.keys(files).forEach((key) => {
            newFiles.items.add(files[key]);
        });

        if (this.fileToUpload) {
            Object.keys(this.fileToUpload).forEach((key) => {
                newFiles.items.add(this.fileToUpload[key]);
            });
        }
        this.fileToUpload = newFiles.files;
        this.onFileUpdate.emit(this.fileToUpload);
    }



    /**
     * This function is used to remove document from a particular item of RFQ
     * @param i index of the document
     */
    removeFile(i) {
        let newFiles = new DataTransfer();
        Object.keys(this.fileToUpload).forEach((key) => {
            if (Number(key) !== i) {
                newFiles.items.add(this.fileToUpload[key]);
            }
        });
        this.fileToUpload = newFiles.files;
        this.onFileUpdate.emit(this.fileToUpload);
    }

    // uploadDocs(fileUploadType: string, fileLIst: FileList) {

    //     return this.commonService.getUniqueId().then(response => {

    //         if (fileLIst && fileLIst.length) {

    //             const data = new FormData();

    //             const fileArr: File[] = [];

    //             for (let key in Object.keys(fileLIst)) {
    //                 fileArr.push(fileLIst[ key ]);
    //                 data.append(`files[${key}]`, fileLIst[ key ]);
    //             }
    //             // data.append(`files`, fileArr);
    //             data.append('fileUploadType', fileUploadType);
    //             data.append('parentId', response.id);
    //             return this.commonService.docUpload(data).then(res => {
    //                 return res;
    //             });
    //         } else {
    //             return of().toPromise();
    //         }

    //     });
    // }

    viewFile(file){
        var win = window.open(file, '_blank');
        win.focus();
    }

    blankFiles(){
        this.fileToUpload = (new DataTransfer()).files;
    }

}
