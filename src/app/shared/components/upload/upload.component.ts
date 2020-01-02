import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoggerService } from '../../services/logger.service';
// import { CommonService } from '../../services/common.service';
// import { of } from 'rxjs';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html'
})
export class UploadComponent implements OnInit {

    fileToUpload: FileList;
    deletedDocs: number[] = [];
    id: number;
    @Output('onFileUpdate') onFileUpdate = new EventEmitter<FileList>();
    @Input('parentId') parentId;
    fileExtension: string;

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

        /**
         * Checked the condition if uploaded file extension is pdf or any other
         */
        const [filename, fileExt] = files[0].name.split(".");
        this.fileExtension = fileExt;
        
        this.onFileUpdate.emit(this.fileToUpload);
    }

    /**
     * This function is used to remove document
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

    viewFile(file){
        var win = window.open(file, '_blank');
        win.focus();
    }

    blankFiles(){
        this.fileToUpload = (new DataTransfer()).files;
    }

    fileChange(name, index){
        LoggerService.debug(name + " , " + index);
    }
}
