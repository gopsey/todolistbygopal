import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  lists = [];
  connectedTo = [];
  deleteListIdCardId: string = '';
  commentTextValue;

  constructor() {
    this.lists = [];
    this.pushConnectedTo();
  }

  addNewList() {
    let obj = { id: '', cards: [] };
    let listsLength = this.lists.length;
    let listLengthsArray = [];
    for (let i = 0; i < this.lists.length; i++) {
      listLengthsArray.push(parseInt(this.lists[i].id));
    }
    let maxValue = Math.max(...listLengthsArray);
    if (listsLength.toString() === maxValue.toString()) {
      obj.id = `${this.lists.length + 1}`;
    } else if (listsLength < maxValue) {
      obj.id = `${maxValue + 1}`;
    } else {
      obj.id = `${this.lists.length}`;
    }
    this.lists.push(obj);
    this.pushConnectedTo();
  }

  deleteList(listId: any) {
    let listIdToDelete = listId;
    this.lists.splice(listIdToDelete, 1);
    this.pushConnectedTo();
  }

  addNewCard(listId: any) {
    let listIdToAdd = listId;
    let currentList = this.lists[listIdToAdd].cards;
    let cardId = `${currentList.length}`;
    let cardObj = { id: '', cardTitle: '', cardDescription: '', comments: [] };
    cardObj.id = cardId;
    cardObj.cardTitle = 'Card Title';
    currentList.push(cardObj);
  }

  openModal(listId: any, cardIndex: any) {
    (<HTMLElement>document.querySelector('.modal')).setAttribute('style', 'display: block');
    (<HTMLInputElement>document.getElementById('card-title')).value = this.lists[listId].cards.find(item => item.id === cardIndex).cardTitle;
    (<HTMLInputElement>document.getElementById('card-description')).value = this.lists[listId].cards.find(item => item.id === cardIndex).cardDescription;
    this.commentTextValue = this.lists[listId].cards.find(item => item.id === cardIndex).comments;
    this.deleteListIdCardId = `${listId},${cardIndex}`;
    (<HTMLElement>document.querySelector('.deleteClass')).setAttribute('id', this.deleteListIdCardId);
  }

  closeModal() {
    (<HTMLElement>document.querySelector('.modal')).setAttribute('style', 'display: none');
  }

  closeModalOutside(deleteListIdCardId: any, cardTitle: string, cardDescription: string) {
    let listAndCardArray = deleteListIdCardId.split(',');
    let listid = parseInt(listAndCardArray[0]);
    let cardId = parseInt(listAndCardArray[1]);
    if (event.target == <HTMLElement>document.querySelector('.modal')) {
      this.lists[listid].cards[cardId].cardTitle = cardTitle;
      this.lists[listid].cards[cardId].cardDescription = cardDescription;
      this.closeModal();
    }
  }

  deleteCard(event: any) {
    let listAndCard = event.target.id;
    let listAndCardArray = listAndCard.split(',');
    let listid = parseInt(listAndCardArray[0]);
    let cardId = parseInt(listAndCardArray[1]);
    this.lists[listid].cards.splice(cardId, 1);
    this.closeModal();
  }

  saveComment(listCardId: string) {
    let listAndCardArray = listCardId.split(',');
    let listid = parseInt(listAndCardArray[0]);
    let cardId = parseInt(listAndCardArray[1]);
    var currentdate = new Date();
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let month = monthNames[(currentdate.getMonth())];
    var datetime = `${currentdate.getDate()} ${month} ${currentdate.getFullYear()} ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
    let commentObj = { comment: '', date: '' }
    let commentTextValue = (document.getElementById("commentText") as HTMLTextAreaElement).value;
    commentObj.comment = commentTextValue;
    commentObj.date = datetime;
    this.lists[listid].cards[cardId].comments.push(commentObj);
    (document.getElementById("commentText") as HTMLTextAreaElement).value = '';
  }

  pushConnectedTo() {
    for (let list of this.lists) {
      this.connectedTo.push(list.id);
    };
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
