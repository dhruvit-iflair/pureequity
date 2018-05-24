import { Directive, HostListener, HostBinding, EventEmitter, Output } from '@angular/core';

@Directive({
    selector: '[fileDrop]'
})
export class FileDropDirective {
    private allowed_extensions: Array<any> = ['png', 'jpg', 'bmp', 'jpeg'];
    @Output() private filesChangeEmiter: EventEmitter<File[]> = new EventEmitter();

    constructor() { }

    @HostListener('drop', ['$event']) public onDrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let files = evt.dataTransfer.files;
        let valid_files: Array<File> = [];
        if (files.length > 0) {
            files.forEach((file: File) => {
                let ext = file.name.split('.')[file.name.split('.').length - 1];
                if (this.allowed_extensions.lastIndexOf(ext) != -1) {
                    valid_files.push(file);
                }
            });
            this.filesChangeEmiter.emit(valid_files);
        }
    }

}